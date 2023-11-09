interface Message {
  chromeExtensioName: string
  payload: MessagePayload
}

interface MessagePayload {
  [key: string]: unknown
}

export async function braodcastMessage(
  message: Message,
  queryInfo: chrome.tabs.QueryInfo | {} = {},
): Promise<any[]> {
  const promises: Promise<any>[] = []
  chrome.tabs.query(queryInfo, (tabs) => {
    for (let tab of tabs) {
      if (tab.id) {
        const res = sendMessageToTab(tab.id, message)
        promises.push(res)
      }
    }
  })
  return Promise.all(promises)
}

export async function sendMessageToTab(tabId: number, message: Message) {
  const response = await chrome.tabs.sendMessage(tabId, message)
  return response
}

export async function sendMessageToServiceWorker(message: Message) {
  const response = await chrome.runtime.sendMessage(message)
  return response
}

export function onMessageReceive(
  callback: (
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: any,
  ) => void,
) {
  chrome.runtime.onMessage.addListener(callback)
}
