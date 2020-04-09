type ValidContentTypes = "image/jpeg"
export function base64toBlob(
  base64Data: string,
  contentType: ValidContentTypes,
) {
  contentType = contentType || ""
  const sliceSize = 1024
  const byteCharacters = window.atob(base64Data)
  const bytesLenght = byteCharacters.length
  const slicesCount = Math.ceil(bytesLenght / sliceSize)
  const byteArrays = new Array(slicesCount)

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize
    const end = Math.min(begin + sliceSize, bytesLenght)
    const bytes = new Array(end - begin)
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0)
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes)
  }
  return new Blob(byteArrays, { type: contentType })
}

/**
 *
 * base64FromPath is a helper method that will take in a path to a file and return back the base64 encoded representation of that file.
 * @param path String
 */
export function base64FromPath(path: string): Promise<string>
export async function base64FromPath(path: string) {
  const response = await fetch(path)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject("method did not return a string")
      }
    }
    reader.readAsDataURL(blob)
  })
}
