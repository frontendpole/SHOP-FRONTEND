export class Modal {
    static ACCEPT = 'ACCEPT';
    static CANCEL = 'CANCEL';

    constructor(config) {
        this.config = {
            hasBackground: true,
            message: null,
            htmlContent: null,
            ...config,
        };
        if (this.config.hasBackground) {
            this.modalBackgroundElement = this.createDiv('modal-background');
            document.body.appendChild(this.modalBackgroundElement);
            this.modalBackgroundElement.addEventListener('click', () => {
                this.cancel();
            });
        }

        this.modalElement = this.createDiv('modal');
        this.modalHeader = this.createDiv('modal-header');
        this.modalFooter = this.createFooter();
        this.modalContent = this.createDiv('modal-content');

        if (this.config.message !== null) {
            this.modalContent.innerHTML = this.config.message;
        } else if (this.config.htmlContent !== null) {
            const content = this.config.htmlContent.cloneNode(true);
            content.style.display = 'block';
            this.modalContent.appendChild(content);
            content.classList.remove('modal');
            this.config.htmlContent.remove();
        } else {
            throw new Error('Modal has no content');
        }
        this.modalElement.appendChild(this.modalHeader);
        this.modalElement.appendChild(this.modalContent);
        this.modalElement.appendChild(this.modalFooter);
        document.body.appendChild(this.modalElement);
    }

    open() {
        this.modalBackgroundElement.classList.add('open');
        this.modalElement.classList.add('open');
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    _closeModal() {
        this.modalBackgroundElement.classList.remove('open');
        this.modalElement.classList.remove('open');
    }

    close(closeType) {
        this._closeModal();
        this.resolve(closeType || Modal.CANCEL);
    }

    cancel() {
        this._closeModal();
        this.resolve(Modal.CANCEL);
    }

    createDiv(className) {
        const div = document.createElement('div');
        div.className = className;
        return div;
    }

    createFooter() {
        const footer = this.createDiv('modal-footer');
        const accept = document.createElement('button');
        accept.innerText = 'Accept';
        accept.classList.add('accept-button');
        accept.addEventListener('click', () => {
            this.close(Modal.ACCEPT);
        });
        const cancel = document.createElement('button');
        cancel.innerText = 'Close';
        cancel.classList.add('cancel-button');
        cancel.addEventListener('click', () => {
            this.close(Modal.CANCEL);
        });
        footer.appendChild(accept);
        footer.appendChild(cancel);
        return footer;
    }
}
