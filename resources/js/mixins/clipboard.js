export default {
    methods: {
        copyToClipboard (value) {
            const textArea = document.createElement('textarea');
            textArea.value = value;
            textArea.style.cssText =
                'position:absolute;top:0;left:0;z-index:-9999;opacity:0;';
            document.body.appendChild(textArea);
            const isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);
            if (isiOSDevice) {
                const editable = textArea.contentEditable;
                const readOnly = textArea.readOnly;
                textArea.contentEditable = true;
                textArea.readOnly = false;
                const range = document.createRange();
                range.selectNodeContents(textArea);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                textArea.setSelectionRange(0, 999999);
                textArea.contentEditable = editable;
                textArea.readOnly = readOnly;
            } else {
                textArea.select();
            }
            try {
                document.execCommand('copy');
            } catch (err) {
                console.log(err);
            }
            document.body.removeChild(textArea);
        }
    }
}