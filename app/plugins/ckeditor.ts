declare global {
  interface Window {
    CKEDITOR: any;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const isLoaded = ref(false);

  if (import.meta.client) {
    const scriptUrl = "/ckeditor/ckeditor.js"; // Path to your CKEditor file in public folder

    // Check if CKEditor is already loaded
    if (window.CKEDITOR) {
      isLoaded.value = true;
    } else {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.onload = () => {
        isLoaded.value = true;
      };
      document.head.appendChild(script);
    }
  }

  return {
    provide: {
      ckeditorLoaded: isLoaded,
    },
  };
});
