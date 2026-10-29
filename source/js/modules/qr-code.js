/**
 * miVIT3 — Módulo de Código QR Dinámico
 * Generación matemática nativa de Códigos QR (sin librerías externas),
 * vinculación inteligente con LinkedIn/Portafolio y renderizado SVG de alta definición.
 */

(function () {
  'use strict';

  window.miVit3 = window.miVit3 || {};

  const STORAGE_KEY = 'mivit3_qr_config';

  // =========================================================================
  // Motor Matemático QR (100% Vanilla JS, Reed-Solomon + Byte Encoding)
  // =========================================================================

  const QRMatrixEngine = (function () {
    const MODE_8BIT_BYTE = 1 << 2;
    const QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };

    function QRPolynomial(num, shift) {
      if (num.length == undefined) throw new Error(num.length + "/" + shift);
      let offset = 0;
      while (offset < num.length && num[offset] == 0) offset++;
      this.num = new Array(num.length - offset + shift);
      for (let i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
      for (let i = num.length - offset; i < this.num.length; i++) this.num[i] = 0;
    }
    QRPolynomial.prototype = {
      get: function (i) { return this.num[i]; },
      getLength: function () { return this.num.length; },
      multiply: function (e) {
        const num = new Array(this.getLength() + e.getLength() - 1);
        for (let i = 0; i < this.getLength(); i++) {
          for (let j = 0; j < e.getLength(); j++) {
            num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
          }
        }
        return new QRPolynomial(num, 0);
      },
      mod: function (e) {
        if (this.getLength() - e.getLength() < 0) return this;
        const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
        const num = new Array(this.getLength());
        for (let i = 0; i < this.getLength(); i++) num[i] = this.get(i);
        for (let i = 0; i < e.getLength(); i++) {
          num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
        }
        return new QRPolynomial(num, 0).mod(e);
      }
    };

    const QRMath = {
      glog: function (n) {
        if (n < 1) throw new Error("glog(" + n + ")");
        return QRMath.LOG_TABLE[n];
      },
      gexp: function (n) {
        while (n < 0) n += 255;
        while (n >= 255) n -= 255;
        return QRMath.EXP_TABLE[n];
      },
      EXP_TABLE: new Array(256),
      LOG_TABLE: new Array(256)
    };
    for (let i = 0; i < 8; i++) QRMath.EXP_TABLE[i] = 1 << i;
    for (let i = 8; i < 256; i++) {
      QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
    }
    for (let i = 0; i < 255; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;

    const QRMaskPattern = {
      PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3,
      PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7
    };

    const QRUtil = {
      PATTERN_POSITION_TABLE: [
        [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
        [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54]
      ],
      G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
      G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
      G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
      getBCHTypeInfo: function (data) {
        let d = data << 10;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
          d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15)));
        }
        return ((data << 10) | d) ^ QRUtil.G15_MASK;
      },
      getBCHDigit: function (data) {
        let digit = 0;
        while (data != 0) { digit++; data >>>= 1; }
        return digit;
      },
      getPatternPosition: function (typeNumber) {
        return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1] || [];
      },
      getMask: function (maskPattern, i, j) {
        switch (maskPattern) {
          case QRMaskPattern.PATTERN000: return (i + j) % 2 == 0;
          case QRMaskPattern.PATTERN001: return i % 2 == 0;
          case QRMaskPattern.PATTERN010: return j % 3 == 0;
          case QRMaskPattern.PATTERN011: return (i + j) % 3 == 0;
          case QRMaskPattern.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
          case QRMaskPattern.PATTERN101: return ((i * j) % 2) + ((i * j) % 3) == 0;
          case QRMaskPattern.PATTERN110: return (((i * j) % 2) + ((i * j) % 3)) % 2 == 0;
          case QRMaskPattern.PATTERN111: return (((i * j) % 3) + ((i + j) % 2)) % 2 == 0;
          default: throw new Error("bad maskPattern:" + maskPattern);
        }
      },
      getErrorCorrectPolynomial: function (errorCorrectLength) {
        let a = new QRPolynomial([1], 0);
        for (let i = 0; i < errorCorrectLength; i++) {
          a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
        }
        return a;
      },
      getLengthInBits: function (mode, type) {
        return (1 <= type && type < 10) ? 8 : 16;
      },
      getLostPoint: function (qrCode) {
        const moduleCount = qrCode.getModuleCount();
        let lostPoint = 0;
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            let sameCount = 0;
            const dark = qrCode.isDark(row, col);
            for (let r = -1; r <= 1; r++) {
              if (row + r < 0 || moduleCount <= row + r) continue;
              for (let c = -1; c <= 1; c++) {
                if (col + c < 0 || moduleCount <= col + c) continue;
                if (r == 0 && c == 0) continue;
                if (dark == qrCode.isDark(row + r, col + c)) sameCount++;
              }
            }
            if (sameCount > 5) lostPoint += (3 + sameCount - 5);
          }
        }
        for (let row = 0; row < moduleCount - 1; row++) {
          for (let col = 0; col < moduleCount - 1; col++) {
            let count = 0;
            if (qrCode.isDark(row, col)) count++;
            if (qrCode.isDark(row + 1, col)) count++;
            if (qrCode.isDark(row, col + 1)) count++;
            if (qrCode.isDark(row + 1, col + 1)) count++;
            if (count == 0 || count == 4) lostPoint += 3;
          }
        }
        return lostPoint;
      }
    };

    const RS_BLOCK_TABLE = [
      [1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9],
      [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16],
      [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13],
      [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9],
      [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12],
      [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15],
      [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14]
    ];

    function QRRSBlock(totalCount, dataCount) {
      this.totalCount = totalCount;
      this.dataCount = dataCount;
    }
    QRRSBlock.getRSBlocks = function (typeNumber, errorCorrectLevel) {
      const rsBlock = RS_BLOCK_TABLE[(typeNumber - 1) * 4 + errorCorrectLevel];
      if (!rsBlock) throw new Error("bad rs block @ typeNumber:" + typeNumber);
      const length = rsBlock.length / 3;
      const list = [];
      for (let i = 0; i < length; i++) {
        const count = rsBlock[i * 3 + 0];
        const totalCount = rsBlock[i * 3 + 1];
        const dataCount = rsBlock[i * 3 + 2];
        for (let j = 0; j < count; j++) list.push(new QRRSBlock(totalCount, dataCount));
      }
      return list;
    };

    function QRBitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    QRBitBuffer.prototype = {
      get: function (index) {
        const bufIndex = Math.floor(index / 8);
        return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1;
      },
      put: function (num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit(((num >>> (length - i - 1)) & 1) == 1);
        }
      },
      getLengthInBits: function () { return this.length; },
      putBit: function (bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) this.buffer.push(0);
        if (bit) this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
        this.length++;
      }
    };

    function QR8bitByte(data) {
      this.mode = MODE_8BIT_BYTE;
      this.data = data;
    }
    QR8bitByte.prototype = {
      getLength: function () { return unescape(encodeURIComponent(this.data)).length; },
      write: function (buffer) {
        const utf8 = unescape(encodeURIComponent(this.data));
        for (let i = 0; i < utf8.length; i++) buffer.put(utf8.charCodeAt(i), 8);
      }
    };

    function QRCodeModel(typeNumber, errorCorrectLevel) {
      this.typeNumber = typeNumber;
      this.errorCorrectLevel = errorCorrectLevel;
      this.modules = null;
      this.moduleCount = 0;
      this.dataCache = null;
      this.dataList = [];
    }
    QRCodeModel.prototype = {
      addData: function (data) { this.dataList.push(new QR8bitByte(data)); this.dataCache = null; },
      isDark: function (row, col) { return this.modules[row][col]; },
      getModuleCount: function () { return this.moduleCount; },
      make: function () {
        if (this.typeNumber < 1) {
          for (let t = 1; t <= 7; t++) {
            const rsBlocks = QRRSBlock.getRSBlocks(t, this.errorCorrectLevel);
            const buffer = new QRBitBuffer();
            let totalDataCount = 0;
            for (let i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
            for (let i = 0; i < this.dataList.length; i++) {
              const data = this.dataList[i];
              buffer.put(data.mode, 4);
              buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, t));
              data.write(buffer);
            }
            if (buffer.getLengthInBits() <= totalDataCount * 8) {
              this.typeNumber = t;
              break;
            }
          }
        }
        this.makeImpl(false, this.getBestMaskPattern());
      },
      makeImpl: function (test, maskPattern) {
        this.moduleCount = this.typeNumber * 4 + 17;
        this.modules = new Array(this.moduleCount);
        for (let row = 0; row < this.moduleCount; row++) {
          this.modules[row] = new Array(this.moduleCount);
          for (let col = 0; col < this.moduleCount; col++) this.modules[row][col] = null;
        }
        this.setupPositionProbePattern(0, 0);
        this.setupPositionProbePattern(this.moduleCount - 7, 0);
        this.setupPositionProbePattern(0, this.moduleCount - 7);
        this.setupPositionAdjustPattern();
        this.setupTimingPattern();
        this.setupTypeInfo(test, maskPattern);
        if (this.dataCache == null) {
          this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
        }
        this.mapData(this.dataCache, maskPattern);
      },
      setupPositionProbePattern: function (row, col) {
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || this.moduleCount <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || this.moduleCount <= col + c) continue;
            if ((0 <= r && r <= 6 && (c == 0 || c == 6)) ||
              (0 <= c && c <= 6 && (r == 0 || r == 6)) ||
              (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      },
      getBestMaskPattern: function () {
        let minLostPoint = 0;
        let pattern = 0;
        for (let i = 0; i < 8; i++) {
          this.makeImpl(true, i);
          const lostPoint = QRUtil.getLostPoint(this);
          if (i == 0 || minLostPoint > lostPoint) {
            minLostPoint = lostPoint;
            pattern = i;
          }
        }
        return pattern;
      },
      setupTimingPattern: function () {
        for (let r = 8; r < this.moduleCount - 8; r++) {
          if (this.modules[r][6] != null) continue;
          this.modules[r][6] = (r % 2 == 0);
        }
        for (let c = 8; c < this.moduleCount - 8; c++) {
          if (this.modules[6][c] != null) continue;
          this.modules[6][c] = (c % 2 == 0);
        }
      },
      setupPositionAdjustPattern: function () {
        const pos = QRUtil.getPatternPosition(this.typeNumber);
        for (let i = 0; i < pos.length; i++) {
          for (let j = 0; j < pos.length; j++) {
            const row = pos[i];
            const col = pos[j];
            if (this.modules[row][col] != null) continue;
            for (let r = -2; r <= 2; r++) {
              for (let c = -2; c <= 2; c++) {
                if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) {
                  this.modules[row + r][col + c] = true;
                } else {
                  this.modules[row + r][col + c] = false;
                }
              }
            }
          }
        }
      },
      setupTypeInfo: function (test, maskPattern) {
        const data = (this.errorCorrectLevel << 3) | maskPattern;
        const bits = QRUtil.getBCHTypeInfo(data);
        for (let i = 0; i < 15; i++) {
          const mod = (!test && ((bits >> i) & 1) == 1);
          if (i < 6) this.modules[i][8] = mod;
          else if (i < 8) this.modules[i + 1][8] = mod;
          else this.modules[this.moduleCount - 15 + i][8] = mod;
        }
        for (let i = 0; i < 15; i++) {
          const mod = (!test && ((bits >> i) & 1) == 1);
          if (i < 8) this.modules[8][this.moduleCount - i - 1] = mod;
          else if (i < 9) this.modules[8][15 - i - 1 + 1] = mod;
          else this.modules[8][15 - i - 1] = mod;
        }
        this.modules[this.moduleCount - 8][8] = !test;
      },
      mapData: function (data, maskPattern) {
        let inc = -1;
        let row = this.moduleCount - 1;
        let bitIndex = 7;
        let byteIndex = 0;
        for (let col = this.moduleCount - 1; col > 0; col -= 2) {
          if (col == 6) col--;
          while (true) {
            for (let c = 0; c < 2; c++) {
              if (this.modules[row][col - c] == null) {
                let dark = false;
                if (byteIndex < data.length) {
                  dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
                }
                const mask = QRUtil.getMask(maskPattern, row, col - c);
                if (mask) dark = !dark;
                this.modules[row][col - c] = dark;
                bitIndex--;
                if (bitIndex == -1) { byteIndex++; bitIndex = 7; }
              }
            }
            row += inc;
            if (row < 0 || this.moduleCount <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      }
    };

    QRCodeModel.createData = function (typeNumber, errorCorrectLevel, dataList) {
      const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
      const buffer = new QRBitBuffer();
      for (let i = 0; i < dataList.length; i++) {
        const data = dataList[i];
        buffer.put(data.mode, 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
        data.write(buffer);
      }
      let totalDataCount = 0;
      for (let i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw new Error("code length overflow");
      }
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);
      while (buffer.getLengthInBits() % 8 != 0) buffer.putBit(false);
      while (true) {
        if (buffer.getLengthInBits() >= totalDataCount * 8) break;
        buffer.put(0xec, 8);
        if (buffer.getLengthInBits() >= totalDataCount * 8) break;
        buffer.put(0x11, 8);
      }
      return QRCodeModel.createBytes(buffer, rsBlocks);
    };

    QRCodeModel.createBytes = function (buffer, rsBlocks) {
      let offset = 0;
      let maxDcCount = 0;
      let maxEcCount = 0;
      const dcdata = new Array(rsBlocks.length);
      const ecdata = new Array(rsBlocks.length);
      for (let r = 0; r < rsBlocks.length; r++) {
        const dcCount = rsBlocks[r].dataCount;
        const ecCount = rsBlocks[r].totalCount - dcCount;
        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);
        dcdata[r] = new Array(dcCount);
        for (let i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 0xff & buffer.buffer[i + offset];
        offset += dcCount;
        const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        const rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
        const modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (let i = 0; i < ecdata[r].length; i++) {
          const modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
        }
      }
      let totalCodeCount = 0;
      for (let i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
      const data = new Array(totalCodeCount);
      let index = 0;
      for (let i = 0; i < maxDcCount; i++) {
        for (let r = 0; r < rsBlocks.length; r++) {
          if (i < dcdata[r].length) data[index++] = dcdata[r][i];
        }
      }
      for (let i = 0; i < maxEcCount; i++) {
        for (let r = 0; r < rsBlocks.length; r++) {
          if (i < ecdata[r].length) data[index++] = ecdata[r][i];
        }
      }
      return data;
    };

    return {
      generateSvg: function (text, options) {
        options = options || {};
        const cellSize = options.cellSize || 3;
        const margin = options.margin !== undefined ? options.margin : 2;
        const color = options.color || "#0f172a";
        const bg = options.background || "#ffffff";

        const qr = new QRCodeModel(0, QRErrorCorrectLevel.M);
        qr.addData(text);
        qr.make();

        const count = qr.getModuleCount();
        const size = (count + margin * 2) * cellSize;
        let path = "";

        for (let r = 0; r < count; r++) {
          for (let c = 0; c < count; c++) {
            if (qr.isDark(r, c)) {
              const x = (c + margin) * cellSize;
              const y = (r + margin) * cellSize;
              path += `M${x},${y}h${cellSize}v${cellSize}h-${cellSize}z `;
            }
          }
        }

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%" shape-rendering="crispEdges">
          <rect width="${size}" height="${size}" fill="${bg}"/>
          <path d="${path}" fill="${color}"/>
        </svg>`;
      }
    };
  })();

  // =========================================================================
  // Detección Inteligente de Enlaces del CV
  // =========================================================================

  function detectLinksFromCV() {
    const cvDoc = document.getElementById('cv-document');
    const links = {
      linkedin: '',
      github: '',
      whatsapp: '',
      web: '',
      name: 'Mi CV'
    };
    if (!cvDoc) return links;

    const nameEl = cvDoc.querySelector('.cv-name');
    if (nameEl) links.name = nameEl.textContent.trim() || 'Mi CV';

    cvDoc.querySelectorAll('.cv-contact-item').forEach(li => {
      const text = li.textContent.trim();
      if (/linkedin\.com/i.test(text)) {
        links.linkedin = text.startsWith('http') ? text : `https://${text}`;
      } else if (/github\.com/i.test(text)) {
        links.github = text.startsWith('http') ? text : `https://${text}`;
      } else if (/http/i.test(text) && !/linkedin|github/i.test(text)) {
        links.web = text.startsWith('http') ? text : `https://${text}`;
      } else if (/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/.test(text)) {
        const cleanDigits = text.replace(/\D/g, '');
        if (cleanDigits.length >= 8) {
          links.whatsapp = `https://wa.me/${cleanDigits}`;
        }
      }
    });

    // Fallback de Web si no hay enlace explícito
    if (!links.web) {
      const slug = links.name.toLowerCase().replace(/[^a-záéíóúüñ0-9]+/g, '-').replace(/^-|-$/g, '') || 'cv';
      links.web = `https://${slug}.github.io`;
    }

    return links;
  }

  // =========================================================================
  // Estado y Persistencia
  // =========================================================================

  function getDefaultConfig() {
    const detected = detectLinksFromCV();
    const defaultUrl = detected.linkedin || detected.web || 'https://mivit3.com';

    return {
      enabled: false,
      url: defaultUrl,
      targetType: detected.linkedin ? 'linkedin' : 'web',
      position: 'header', // 'header' o 'footer'
      label: 'Ver Portafolio',
      useAccentColor: true
    };
  }

  function getQrConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return Object.assign(getDefaultConfig(), JSON.parse(raw));
    } catch (e) { }
    return getDefaultConfig();
  }

  function saveQrConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) { }
  }

  // =========================================================================
  // Renderizado en el CV
  // =========================================================================

  function ensureQrContainers() {
    const cvDoc = document.getElementById('cv-document');
    if (!cvDoc) return null;

    let headerWrap = document.getElementById('cvQrHeaderWrap');
    if (!headerWrap) {
      const header = cvDoc.querySelector('.cv-profile-header') || cvDoc;
      headerWrap = document.createElement('div');
      headerWrap.id = 'cvQrHeaderWrap';
      headerWrap.className = 'cv-qr-badge cv-qr-header';
      headerWrap.style.display = 'none';
      headerWrap.title = 'Clic para configurar Código QR';
      headerWrap.innerHTML = '<div class="cv-qr-svg-wrap" id="cvQrHeaderSvg"></div><span class="cv-qr-label" id="cvQrHeaderLabel">Ver Portafolio</span>';
      header.appendChild(headerWrap);
      headerWrap.addEventListener('click', openQrConfigModal);
    }

    let footerWrap = document.getElementById('cvQrFooterWrap');
    if (!footerWrap) {
      footerWrap = document.createElement('div');
      footerWrap.id = 'cvQrFooterWrap';
      footerWrap.className = 'cv-qr-badge cv-qr-footer';
      footerWrap.style.display = 'none';
      footerWrap.title = 'Clic para configurar Código QR';
      footerWrap.innerHTML = '<div class="cv-qr-svg-wrap" id="cvQrFooterSvg"></div><span class="cv-qr-label" id="cvQrFooterLabel">Ver Portafolio</span>';
      cvDoc.appendChild(footerWrap);
      footerWrap.addEventListener('click', openQrConfigModal);
    }

    return { headerWrap, footerWrap };
  }

  function renderQrInCV() {
    const config = getQrConfig();
    const containers = ensureQrContainers();

    const headerBadge = document.getElementById('cvQrHeaderWrap');
    const footerBadge = document.getElementById('cvQrFooterWrap');

    if (!headerBadge || !footerBadge) return;

    if (!config.enabled || !config.url) {
      headerBadge.style.display = 'none';
      footerBadge.style.display = 'none';
      return;
    }

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent').trim() || '#0f172a';
    const qrColor = config.useAccentColor ? accent : '#0f172a';

    let svgHtml = '';
    try {
      svgHtml = QRMatrixEngine.generateSvg(config.url, {
        color: qrColor,
        background: '#ffffff',
        cellSize: 3,
        margin: 1
      });
    } catch (e) {
      console.warn('Error generando QR SVG:', e);
      return;
    }

    if (config.position === 'header') {
      headerBadge.style.display = 'inline-flex';
      footerBadge.style.display = 'none';

      const svgWrap = document.getElementById('cvQrHeaderSvg');
      const labelEl = document.getElementById('cvQrHeaderLabel');
      if (svgWrap) svgWrap.innerHTML = svgHtml;
      if (labelEl) labelEl.textContent = config.label || '';
    } else {
      headerBadge.style.display = 'none';
      footerBadge.style.display = 'inline-flex';

      const svgWrap = document.getElementById('cvQrFooterSvg');
      const labelEl = document.getElementById('cvQrFooterLabel');
      if (svgWrap) svgWrap.innerHTML = svgHtml;
      if (labelEl) labelEl.textContent = config.label || '';
    }
  }

  // =========================================================================
  // Modal de Configuración
  // =========================================================================

  function openQrConfigModal() {
    const modal = document.getElementById('qrConfigModal');
    if (!modal) return;

    const config = getQrConfig();
    const detected = detectLinksFromCV();

    // Toggle switch
    const toggle = document.getElementById('qrEnableSwitch');
    if (toggle) toggle.checked = config.enabled;

    // URL input
    const urlInput = document.getElementById('qrUrlInput');
    if (urlInput) urlInput.value = config.url || '';

    // Label input
    const labelInput = document.getElementById('qrLabelInput');
    if (labelInput) labelInput.value = config.label || 'Ver Portafolio';

    // Position radio
    const posHeaderRadio = document.getElementById('qrPosHeader');
    const posFooterRadio = document.getElementById('qrPosFooter');
    if (posHeaderRadio) posHeaderRadio.checked = config.position === 'header';
    if (posFooterRadio) posFooterRadio.checked = config.position === 'footer';

    // Color radio
    const colAccentRadio = document.getElementById('qrColorAccent');
    const colMonoRadio = document.getElementById('qrColorMono');
    if (colAccentRadio) colAccentRadio.checked = config.useAccentColor !== false;
    if (colMonoRadio) colMonoRadio.checked = config.useAccentColor === false;

    // Presets chips
    document.querySelectorAll('.qr-chip-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === config.targetType);
    });

    updateModalPreview();
    modal.classList.add('show');
  }

  function closeQrConfigModal() {
    const modal = document.getElementById('qrConfigModal');
    if (modal) modal.classList.remove('show');
  }

  function updateModalPreview() {
    const urlInput = document.getElementById('qrUrlInput');
    const previewBox = document.getElementById('qrModalPreviewSvg');
    const previewUrlText = document.getElementById('qrModalPreviewUrl');
    const colAccentRadio = document.getElementById('qrColorAccent');

    const url = (urlInput ? urlInput.value.trim() : '') || 'https://mivit3.com';
    if (previewUrlText) previewUrlText.textContent = url;

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--cv-accent').trim() || '#0f172a';
    const useAccent = colAccentRadio ? colAccentRadio.checked : true;
    const qrColor = useAccent ? accent : '#0f172a';

    try {
      const svg = QRMatrixEngine.generateSvg(url, {
        color: qrColor,
        background: '#ffffff',
        cellSize: 3,
        margin: 1
      });
      if (previewBox) previewBox.innerHTML = svg;
    } catch (e) {
      if (previewBox) previewBox.innerHTML = '<span style="font-size:10px;color:#ef4444;">URL demasiado larga</span>';
    }
  }

  function downloadQrSvg() {
    const previewBox = document.getElementById('qrModalPreviewSvg');
    if (!previewBox) return;

    const svg = previewBox.querySelector('svg');
    if (!svg) return;

    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codigo-qr-cv.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.showToast) window.showToast('Código QR descargado en SVG');
  }

  function saveAndApplyModalConfig() {
    const toggle = document.getElementById('qrEnableSwitch');
    const urlInput = document.getElementById('qrUrlInput');
    const labelInput = document.getElementById('qrLabelInput');
    const posHeaderRadio = document.getElementById('qrPosHeader');
    const colAccentRadio = document.getElementById('qrColorAccent');
    const activeChip = document.querySelector('.qr-chip-btn.active');

    const config = {
      enabled: toggle ? toggle.checked : true,
      url: urlInput ? urlInput.value.trim() : 'https://mivit3.com',
      targetType: activeChip ? activeChip.dataset.target : 'custom',
      position: (posHeaderRadio && posHeaderRadio.checked) ? 'header' : 'footer',
      label: labelInput ? labelInput.value.trim() : 'Ver Portafolio',
      useAccentColor: colAccentRadio ? colAccentRadio.checked : true
    };

    saveQrConfig(config);
    renderQrInCV();
    closeQrConfigModal();

    if (window.showToast) {
      window.showToast(config.enabled ? 'Código QR activado en tu CV' : 'Código QR desactivado');
    }
  }

  // =========================================================================
  // Inicialización de Escuchadores
  // =========================================================================

  function setupQrEventListeners() {
    const btnToggle = document.getElementById('btnToggleQr');
    if (btnToggle) {
      btnToggle.addEventListener('click', openQrConfigModal);
    }

    const headerBadge = document.getElementById('cvQrHeaderWrap');
    const footerBadge = document.getElementById('cvQrFooterWrap');
    if (headerBadge) headerBadge.addEventListener('click', openQrConfigModal);
    if (footerBadge) footerBadge.addEventListener('click', openQrConfigModal);

    const btnClose = document.getElementById('btnCloseQrModal');
    const btnCloseFooter = document.getElementById('btnCloseQrModalFooter');
    const btnSave = document.getElementById('btnSaveQrConfig');
    const btnDownload = document.getElementById('btnDownloadQrSvg');
    const modal = document.getElementById('qrConfigModal');

    if (btnClose) btnClose.addEventListener('click', closeQrConfigModal);
    if (btnCloseFooter) btnCloseFooter.addEventListener('click', closeQrConfigModal);
    if (btnSave) btnSave.addEventListener('click', saveAndApplyModalConfig);
    if (btnDownload) btnDownload.addEventListener('click', downloadQrSvg);

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeQrConfigModal();
      });
    }

    // Chips de destino rápido
    document.querySelectorAll('.qr-chip-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.qr-chip-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const target = this.dataset.target;
        const detected = detectLinksFromCV();
        const urlInput = document.getElementById('qrUrlInput');
        const labelInput = document.getElementById('qrLabelInput');

        if (target === 'linkedin') {
          if (urlInput) urlInput.value = detected.linkedin || 'https://linkedin.com/in/tu-perfil';
          if (labelInput) labelInput.value = 'LinkedIn';
        } else if (target === 'whatsapp') {
          if (urlInput) urlInput.value = detected.whatsapp || 'https://wa.me/5215500000000';
          if (labelInput) labelInput.value = 'WhatsApp';
        } else if (target === 'github') {
          if (urlInput) urlInput.value = detected.github || 'https://github.com/tu-usuario';
          if (labelInput) labelInput.value = 'GitHub';
        } else if (target === 'web') {
          if (urlInput) urlInput.value = detected.web || 'https://tu-portafolio.com';
          if (labelInput) labelInput.value = 'Portafolio Web';
        }

        updateModalPreview();
      });
    });

    // Inputs en vivo en el modal
    const urlInput = document.getElementById('qrUrlInput');
    if (urlInput) {
      urlInput.addEventListener('input', updateModalPreview);
    }

    const radios = document.querySelectorAll('input[name="qrColor"], input[name="qrPos"]');
    radios.forEach(r => r.addEventListener('change', updateModalPreview));

    // Render inicial
    setTimeout(renderQrInCV, 400);
  }

  document.addEventListener('DOMContentLoaded', setupQrEventListeners);

  // Exportar funciones
  window.openQrConfigModal = openQrConfigModal;
  window.renderQrInCV = renderQrInCV;
  window.miVit3.openQrConfigModal = openQrConfigModal;
  window.miVit3.renderQrInCV = renderQrInCV;

})();
