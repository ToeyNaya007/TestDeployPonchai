
class AlertService {
    static showSuccess(title: string, text: string, timer: number = 2000, reload: boolean = false, confirm: boolean = false, redirectUrl: string | null = null) {
        Swal.fire({
            title: title,
            text: text,
            icon: 'success',
            timer: timer,
            timerProgressBar: true, 
            showConfirmButton: confirm,
            willClose: () => {
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                } else if (reload) {
                    window.location.reload();
                }
            }
        });
    }
    

    static showError(title: string, text: string, timer: number = 2000) {
        Swal.fire({
            title: title,
            text: text,
            icon: 'error',
            timer: timer,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {
             
            }
        });
    }

    static showWarning(title: string, text: string, timer: number = 2000) {
        Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            timer: timer,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {
               
            }
        });
    }

   
}

export default AlertService;