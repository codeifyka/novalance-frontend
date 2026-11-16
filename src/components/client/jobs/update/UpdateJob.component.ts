import { ClientHeaderVue } from "@/components/client/header";
import { ClientFooterVue } from "@/components/client/footer";
import RestClientJobs from "@/libs/RestClientJobs";
import { useRoute } from "vue-router";
import { inject, ref, onMounted, type Ref } from "vue";
import type ToastsManager from "@/libs/ToastsManager";
import type { AxiosInstance } from "axios";
import RestCategories from "@/libs/RestCategories";
export default {
  components: { ClientHeaderVue, ClientFooterVue },
  setup() {
    const title = ref("");
    const description = ref("");
    const skills = ref<Category[]>([]);
    const categories = ref<Category[]>([]);
    const selectedSize = ref("Small");
    const selectedLevel = ref("Beginner");
    const budjet = ref<number | string>(0);
    const time = ref("");
    const files = ref("file.pdf");
    const newFile = ref<File | null>(null);
    const isLoading = ref(false);

    let toastManager = inject<Ref<ToastsManager>>("toastManager");
    let route = useRoute();
    const axios = inject<AxiosInstance>("axios");
    const restClientJobs = new RestClientJobs(axios!);
    const restCategories = new RestCategories(axios!);
    const jobId = Number(route.params.id);

    const normalizeSize = (size: any): string => {
      if (!size) return "Small";
      const s = String(size).toLowerCase().trim();
      if (s.includes("med")) return "Medium";
      if (s.includes("large") || s.includes("big")) return "Large";
      return "Small";
    };

    const normalizeLevel = (level: any): string => {
      if (!level) return "Beginner";
      const l = String(level).toLowerCase().trim();
      if (l.includes("inter")) return "Intermediate";
      if (l.includes("exp") || l.includes("adv")) return "Expert";
      return "Beginner";
    };

    function extractErrorMessage(err: any): string {
      if (typeof err === "string") return err;
      if (err?.response?.data?.messages) {
        const msgs = err.response.data.messages;
        if (typeof msgs === "object") {
          const keys = Object.keys(msgs);
          if (keys.length > 0) {
            const val = msgs[keys[0]];
            return Array.isArray(val) ? val[0] : String(val);
          }
        }
        return String(msgs);
      }
      if (err?.response?.data?.error) return String(err.response.data.error);
      if (err?.message) return err.message;
      return "An unexpected error occurred while updating the job.";
    }

    onMounted(async () => {
      try {
        isLoading.value = true;
        let [response, responseCat] = await Promise.all([
          restClientJobs.getById(jobId),
          restCategories.getAll(),
        ]);

        if (responseCat.isSuccess() && responseCat.value) {
          categories.value = responseCat.value;
        }

        if (response.isSuccess()) {
          let job = response.value!;
          title.value = job.title;
          description.value = job.description;
          selectedSize.value = normalizeSize(job.size);
          selectedLevel.value = normalizeLevel(job.experience_level);
          budjet.value = job.budjet;
          time.value = job.expected_delivery_time;
          files.value = job.illustrative_files;

          if (job.categories && job.categories.length > 0) {
            skills.value = job.categories;
          } else {
            let responseCatByJobs = await restCategories.getAllByJobPost(job.id);
            if (responseCatByJobs.isSuccess() && responseCatByJobs.value) {
              skills.value = responseCatByJobs.value;
            }
          }
        } else {
          toastManager?.value.alertError(response.error || "Failed to load job post.");
        }
      } catch (err: any) {
        toastManager?.value.alertError(extractErrorMessage(err));
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    });

    let cancelOperation = () => {
      window.location.href = "/my_jobs";
    };

    function addSkill(skillName: string) {
      if (!skillName) return;
      const trimmed = skillName.trim();
      const exists = skills.value.some((s) => s.name.toLowerCase() === trimmed.toLowerCase());
      if (!exists) {
        const found = categories.value.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
        skills.value.push(found || { id: 0, name: trimmed });
      }
    }

    function removeSkill(skillName: string) {
      skills.value = skills.value.filter((s) => s.name.toLowerCase() !== skillName.toLowerCase());
    }

    function onSelectSkill(ev: Event) {
      const select = ev.target as HTMLSelectElement;
      if (select.value) {
        addSkill(select.value);
        select.value = "";
      }
    }

    const getFileName = (filePath?: string): string => {
      if (!filePath) return "attachment";
      const parts = filePath.split("/");
      let name = parts[parts.length - 1];
      name = name.replace(/^\d+_file_/, "");
      return decodeURIComponent(name) || "attachment";
    };

    function handleFileChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        newFile.value = input.files[0];
      }
    }

    let onSubmit = async () => {
      if (!title.value?.trim()) {
        toastManager?.value.alertError("Please enter a job title.");
        return;
      }
      if (skills.value.length === 0) {
        toastManager?.value.alertError("Please select at least one skill/category.");
        return;
      }

      try {
        isLoading.value = true;
        let response;
        if (newFile.value) {
          const formData = new FormData();
          formData.append("files", newFile.value);
          formData.append("title", title.value);
          formData.append("description", description.value);
          formData.append("skills", JSON.stringify(skills.value.map((s) => s.name)));
          formData.append("level", selectedLevel.value);
          formData.append("size", selectedSize.value);
          formData.append("budjet", String(Number(budjet.value) || 0));
          formData.append("time", String(time.value));
          formData.append("expected_delivery_time", String(time.value));
          response = await restClientJobs.update(jobId, formData);
        } else {
          response = await restClientJobs.update(jobId, {
            title: title.value,
            description: description.value,
            skills: skills.value.map((s) => s.name),
            level: selectedLevel.value,
            size: selectedSize.value,
            budjet: Number(budjet.value) || 0,
            time: String(time.value),
            files: files.value,
            expected_delivery_time: String(time.value),
          });
        }

        if (response.isSuccess()) {
          toastManager?.value.alertSuccess("Job post updated successfully");
          setTimeout(() => {
            window.location.href = "/my_jobs";
          }, 1500);
        } else {
          toastManager?.value.alertError(response.error || "Failed to update job post");
        }
      } catch (err: any) {
        toastManager?.value.alertError(extractErrorMessage(err));
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      title,
      isLoading,
      description,
      skills,
      selectedSize,
      selectedLevel,
      budjet,
      time,
      files,
      newFile,
      onSubmit,
      cancelOperation,
      categories,
      addSkill,
      removeSkill,
      onSelectSkill,
      handleFileChange,
      getFileName,
    };
  },
};
