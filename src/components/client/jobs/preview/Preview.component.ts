import { ClientHeaderVue } from '@/components/client/header';
import { ClientFooterVue } from '@/components/client/footer';
import RestClientJobs from "@/libs/RestClientJobs";
import { useRoute } from "vue-router";
import { JobPostVue } from '@/components/job_post';
import { inject, ref, onMounted } from 'vue'
import type { AxiosInstance } from 'axios';
export default {
  components: { ClientHeaderVue, ClientFooterVue, JobPostVue },
  setup() {
    let route = useRoute();
    const axios = inject<AxiosInstance>('axios');
    const restClientJobs = new RestClientJobs(axios!);
    const jobId = route.params.id
    let job = ref<JobPost | null>(null);
    let isLoading = ref<boolean>(true);
    const colors = ref({
      'text': 'text-regal-brown',
      'background': "bg-white",
    })
    onMounted(async () => {
      isLoading.value = true;
      try {
        let response = await restClientJobs.getById(Number(jobId));
        console.log(response);
        if (response.isSuccess()) {
          job.value = response.value!;
        }
      } catch (error) {
        console.error("Failed to load job details:", error);
      } finally {
        isLoading.value = false;
      }
    });

    const isImageFile = (filePath?: string): boolean => {
      if (!filePath) return false;
      return /\.(jpg|jpeg|png|webp|gif|svg|avif)($|\?)/i.test(filePath);
    };

    const isFileValid = (filePath?: string): boolean => {
      if (!filePath) return false;
      const trimmed = filePath.trim();
      return trimmed !== "" && trimmed !== "file.pdf";
    };

    const getFileUrl = (filePath?: string): string => {
      if (!filePath) return "";
      if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
        return filePath;
      }
      if (filePath.startsWith("/")) {
        return filePath;
      }
      return `/${filePath}`;
    };

    const getFileName = (filePath?: string): string => {
      if (!filePath) return "attachment";
      const parts = filePath.split("/");
      let name = parts[parts.length - 1];
      name = name.replace(/^\d+_file_/, "");
      return decodeURIComponent(name) || "attachment";
    };

    const downloadFile = async (filePath?: string) => {
      if (!filePath) return;
      const url = getFileUrl(filePath);
      const fileName = getFileName(filePath);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network error fetching file");
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    return {
      job,
      colors,
      isLoading,
      isImageFile,
      isFileValid,
      getFileUrl,
      getFileName,
      downloadFile,
    };
  },
};
