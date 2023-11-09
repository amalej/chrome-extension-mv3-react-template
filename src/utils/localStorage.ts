import { getChromeExtensionName } from '.'

export async function saveLocalStorage(obj: Object): Promise<string> {
  const extensionName = getChromeExtensionName()
  const savedData = (await loadLocalStorage()) as Object
  const storageData = {
    [`${extensionName}`]: {
      ...savedData,
      ...obj,
    },
  }
  return new Promise((resolve, reject) => {
    chrome.storage.local
      .set(storageData)
      .then(() => {
        resolve('OK')
      })
      .catch(() => {
        reject('ERROR')
      })
  })
}

export async function loadLocalStorage(): Promise<{
  [key: string]: Array<any>
}> {
  const extensionName = getChromeExtensionName()
  const storageData = await chrome.storage.local.get([`${extensionName}`])
  return storageData[`${extensionName}`] || {}
}

export interface LocalStorageChange {
  newValue: any
  oldValue: any
}

export function localStorageOnChange(
  callback: (changes: LocalStorageChange) => any,
) {
  const extensionName = getChromeExtensionName()
  const listener = (_changes: {
    [key: string]: chrome.storage.StorageChange
  }) => {
    if (_changes[`${extensionName}`] !== undefined) {
      const changes = _changes[`${extensionName}`] as LocalStorageChange
      callback(changes)
    }
  }

  chrome.storage.local.onChanged.addListener(listener)

  const unsub = () => chrome.storage.local.onChanged.removeListener(listener)
  return unsub
}
