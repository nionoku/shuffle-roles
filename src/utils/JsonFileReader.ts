export class JsonFileReader {
  public static readFile (file: File): Promise<Array<object>> {
    return new Promise((resolve, reject) => {
      try {
        const fileReader = new FileReader()
        fileReader.readAsText(file)
        fileReader.onloadend = () => {
          resolve(JSON.parse(fileReader.result as string))
        }
      } catch (err) {
        reject(err)
      }
    })
  }
}
