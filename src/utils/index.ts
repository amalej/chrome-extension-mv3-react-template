type ChromeExtensionEnvironment = 'content' | 'background'

/**
 * Fetches the file from a given path or URL,
 * then return its content as string or text.
 * @param {string} filePath The file path.
 * @return {!Promise<string>} The HTML string fragment.
 */
export async function fetchFileContent(filePath: string): Promise<string> {
  return await (await fetch(chrome.runtime.getURL(filePath))).text()
}

export function getTheme() {
  function wc_rgb_is_light(color: string) {
    const hex = color.match(/(?<=rgb\()(.*)(?=\))/gm)
    if (hex !== null) {
      const hexArr = hex[0].split(',')
      const c_r = parseInt(hexArr[0], 16)
      const c_g = parseInt(hexArr[1], 16)
      const c_b = parseInt(hexArr[2], 16)
      const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000
      return brightness > 155
    }
    return true
  }
  const rgb = window
    .getComputedStyle(document.body, null)
    .getPropertyValue('background-color')
  if (wc_rgb_is_light(rgb)) {
    return 'light'
  } else {
    return 'dark'
  }
}

export function getChromeExtensionName(): string {
  const extensionDetails = chrome.runtime.getManifest()
  return extensionDetails.name
}

export function openOptionsPage() {
  const chromeDetails = chrome.runtime.getManifest()
  const chromeOptionsPage = chromeDetails.options_page
  if (chromeOptionsPage) {
    const optionsUrl = chrome.runtime.getURL(chromeOptionsPage)

    chrome.tabs.query(
      { url: optionsUrl },
      function (tabs: Array<chrome.tabs.Tab>) {
        if (tabs.length && tabs[0].id) {
          chrome.tabs.update(tabs[0].id, { active: true })
        } else {
          chrome.tabs.create({ url: optionsUrl })
        }
      },
    )
  }
}

export function debugLog(...args: Array<unknown>) {
  const chromeEnv = process.env.NODE_ENV
  if (chromeEnv === 'development') {
    console.log(
      ...[`%c[${getChromeExtensionName()}]\n`, 'color: #FFFF00', ...args],
    )
  }
}

export function getChromeExtensionEnvironment(): ChromeExtensionEnvironment {
  if (location.protocol === 'chrome-extension:') {
    return 'background'
  } else {
    return 'content'
  }
}
