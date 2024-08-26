import { osList } from "./data";

export interface ScreenSize {
  width: number;
  height: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface OSInfo {
  name: string;
  version: string;
}

export interface IBrowserInfo {
  name?: string;
  version?: string;
}

export class BrowserInfo {
  giveMeAllYouGot() {
    return {
      screenSize: BrowserInfo.getScreenSize(),
      windowSize: BrowserInfo.getWindowSize(),
      cookiesEnabled: BrowserInfo.areCookiesEnabled(),
      language: BrowserInfo.getLanguage(),
      os: BrowserInfo.getOSInfo(),
      isMobile: BrowserInfo.isMobile(),
      device: BrowserInfo.getDeviceType(),
      browser: this.getBrowserInfo(),
      userString: window.navigator.userAgent,
      network: BrowserInfo.getNetwork(),
    };
  }

  static getScreenSize(): ScreenSize {
    return {
      width: window.screen.width,
      height: window.screen.height,
    };
  }

  static getNetwork(): string {
    let nw = "";
    const connection =
      (window.navigator as any).connection ||
      (window.navigator as any).mozConnection ||
      (window.navigator as any).webkitConnection;

    if (connection) nw = connection.effectiveType;
    return nw;
  }

  static getWindowSize(): WindowSize {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  static isMobile(): boolean {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      ) {
        check = true;
      }
    })(window.navigator.userAgent || window.navigator.vendor);
    return check;
  }

  static getDeviceType(): string {
    const ua =
      window.navigator.userAgent || window.navigator.vendor;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return "mobile";
    }
    return "desktop";
  }

  static areCookiesEnabled(): boolean {
    let cookieEnabled = window.navigator.cookieEnabled;
    if (typeof cookieEnabled === "undefined") {
      document.cookie = "test-cookie";
      return document.cookie.indexOf("test-cookie") !== -1;
    }
    return cookieEnabled;
  }

  static getLanguage(): string {
    return window.navigator.language || (window.navigator as any).userLanguage;
  }

  static getOSInfo(): OSInfo {
    const osName = BrowserInfo.getOSName();
    if (/Windows/.test(osName)) {
      return {
        name: "Windows",
        version: (/Windows (.*)/.exec(osName) || ["Unknown"])[1],
      };
    }
    return {
      name: osName,
      version: BrowserInfo.getOSVersion(osName),
    };
  }

  static getOSName(): string {
    const currentOs = osList.find((os) =>
      os.regex.test(window.navigator.userAgent)
    );
    return currentOs ? currentOs.name : "Unknown";
  }

  static getOSVersion(osName: string): string {
    switch (osName) {
      case "Mac OS X":
        return BrowserInfo.getMacOSVersion();
      case "Android":
        return BrowserInfo.getAndroidOSVersion();
      case "iOS":
        return BrowserInfo.getIOSVersion();
      case "Ubuntu":
        return BrowserInfo.getUbuntuOSVersion();
      default:
        return "Unknown";
    }
  }

  static getMacOSVersion(): string {
    const version = /Mac OS X (10[._\d]+)/.exec(window.navigator.userAgent);
    return version ? version[1].replace(/_/g, ".") : "Unknown";
  }

  static getAndroidOSVersion(): string {
    const version = /Android ([._\d]+)/.exec(window.navigator.userAgent);
    return version ? version[1] : "Unknown";
  }

  static getIOSVersion(): string {
    const version = /OS (\d+([_\d]+)?)/.exec(window.navigator.userAgent);
    return version ? version[1].replace(/_/g, ".") : "Unknown";
  }

  static getUbuntuOSVersion(): string {
    const version = /Ubuntu\/([\d.]+)/.exec(window.navigator.userAgent);
    return version ? version[1] : "Unknown";
  }

  static getOperaInfo(): IBrowserInfo {
    const userAgent = window.navigator.userAgent;
    const match = userAgent.match(/OPR\/([\d.]+)/);
    return {
      name: 'Opera',
      version: match ? match[1] : 'Unknown',
    };
  }

  static getIEInfo(): IBrowserInfo {
    const userAgent = window.navigator.userAgent;
    const match = userAgent.match(/MSIE ([\d.]+)/);
    return {
      name: 'Internet Explorer',
      version: match ? match[1] : 'Unknown',
    };
  }

  static getEdgeInfo(): IBrowserInfo {
    const userAgent = window.navigator.userAgent;
    const match = userAgent.match(/Edg\/([\d.]+)/);
    return {
      name: 'Edge',
      version: match ? match[1] : 'Unknown',
    };
  }

  static getChromeInfo(): IBrowserInfo {
    const userAgent = window.navigator.userAgent;
    const match = userAgent.match(/Chrome\/([\d.]+)/);
    return {
      name: 'Chrome',
      version: match ? match[1] : 'Unknown',
    };
  }

  static getSafariInfo(): IBrowserInfo {
    const userAgent = window.navigator.userAgent;
    const match = userAgent.match(/Version\/([\d.]+).*Safari/);
    return {
      name: 'Safari',
      version: match ? match[1] : 'Unknown',
    };
  }

  static getFirefoxInfo(): IBrowserInfo {
    const userAgent = window.navigator.userAgent;
    const match = userAgent.match(/Firefox\/([\d.]+)/);
    return {
      name: 'Firefox',
      version: match ? match[1] : 'Unknown',
    };
  }

  static getNewerIEInfo(): IBrowserInfo {
    const userAgent = window.navigator.userAgent;
    const match = userAgent.match(/Trident\/[\d.]+; rv:([\d.]+)/);
    return {
      name: 'Internet Explorer',
      version: match ? match[1] : 'Unknown',
    };
  }

  static getUnknownBrowserInfo(): IBrowserInfo {
    return {
      name: 'Unknown',
      version: 'Unknown',
    };
  }

  static getBrowserVersion(browserName: string): string {
    const userAgent = window.navigator.userAgent;
    const pattern = new RegExp(`${browserName}/([\\d.]+)`);
    const match = userAgent.match(pattern);
    return match ? match[1] : 'Unknown';
  }

  static trimVersion(version: string): string {
    let index
    if ((index = version.indexOf(')')) !== -1) {
      // eslint-disable-line
      version = version.substring(0, index)
    }
    if (index !== -1) {
      version = version.substring(0, index)
    }
    if ((index = version.indexOf(' ')) !== -1) {
      // eslint-disable-line
      version = version.substring(0, index)
    }
    return version
  }

  getBrowserInfo(): IBrowserInfo {
    const userAgent = window.navigator.userAgent;

    if (/Opera|OPR/.test(userAgent)) {
      return BrowserInfo.getOperaInfo();
    } else if (/MSIE/.test(userAgent)) {
      return BrowserInfo.getIEInfo();
    } else if (/Edg/.test(userAgent)) {
      return BrowserInfo.getEdgeInfo();
    } else if (/Chrome/.test(userAgent)) {
      return BrowserInfo.getChromeInfo();
    } else if (/Safari/.test(userAgent)) {
      return BrowserInfo.getSafariInfo();
    } else if (/Firefox/.test(userAgent)) {
      return BrowserInfo.getFirefoxInfo();
    } else if (/Trident/.test(userAgent)) {
      return BrowserInfo.getNewerIEInfo();
    } else {
      return BrowserInfo.getUnknownBrowserInfo();
    }
  }
}
