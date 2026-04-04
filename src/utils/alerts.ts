import Swal from "sweetalert2";

const baseTheme = {
     background: "#18181b",
     color: "#fff",
};

export async function showSuccessAlert(title: string, text: string) {
     return Swal.fire({
          icon: "success",
          title,
          text,
          timer: 1500,
          showConfirmButton: false,
          ...baseTheme,
     });
}

export async function showErrorAlert(title: string, text: string) {
     return Swal.fire({
          icon: "error",
          title,
          text,
          ...baseTheme,
     });
}

export async function confirmDeleteAlert() {
     return Swal.fire({
          title: "هل أنت متأكد؟",
          text: "لن تتمكن من التراجع عن هذا!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "نعم، امسح!",
          cancelButtonText: "إلغاء",
          ...baseTheme,
     });
}
