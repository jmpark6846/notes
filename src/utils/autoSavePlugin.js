import { debounce } from 'lodash'

export default function autoSavePlugin(options) {
  console.log('yayayay')
  return {
    onChange: debounce((event, editor, next) => {
      this._autoSave({ type: "title" })
    }, 2000)
  }
}