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
    const title = ref();
    const description = ref("");
    const skills = ref<Category[]>([]);
    const categories = ref<Category[]>([]);
    const selectedSize = ref(0);
    const selectedLevel = ref("");
    const budjet = ref(0);
    const time = ref("");
    const files = ref("file.pdf");
    const isLoading = ref(false);

    let toastManager = inject<Ref<ToastsManager>>("toastManager");
    let route = useRoute();
    const axios = inject<AxiosInstance>("axios");
    const restClientJobs = new RestClientJobs(axios!);
    const restCategories = new RestCategories(axios!);
    const jobId = Number(route.params.id);

    onMounted(async () => {
      try {
        isLoading.value = true;
        let response = await restClientJobs.getById(jobId);
        let responseCat = await restCategories.getAll();
        console.log(response);
        if (response.isSuccess()) {
          let job = response.value!;
          title.value = job.title;
          description.value = job.description;
          selectedSize.value = job.size;
          selectedLevel.value = job.experience_level;
          budjet.value = job.budjet;
          time.value = job.expected_delivery_time;
          files.value = job.illustrative_files;
          categories.value = responseCat.value!;
          console.log(title.value);
          let responseCatByJobs = await restCategories.getAllByJobPost(response.value?.id as number);
          skills.value = responseCatByJobs.value as Category[]
          isLoading.value = false;
        }
      } catch (err) {
        // @ts-ignore
        toastManager?.value.alertError(err.response);
        // let messages = err.response.data.messages;
        console.log(err);
      }
    });

    let cancelOperation = () => {
      window.location.href = "/home";
    };
    
    function addSkill(ev: Event) {
      const target = ev.target as HTMLOptionElement;
      let newSkill = target.value;
      const foundObject = skills.value.find((obj) => obj.name === newSkill);
      if (foundObject) {
        skills.value = skills.value.filter((skill) => skill !== foundObject);
      } else {
        // @ts-ignore
        skills.value.push({ name: newSkill, value: true });
      }
    }

    let onSubmit = async () => {
      let restClientJobs = new RestClientJobs(axios!);
      try {
        isLoading.value = true;
        let response = await restClientJobs.update(jobId, {
          title: title.value,
          description: description.value,
          skills: skills.value,
          level: selectedLevel.value,
          size: selectedSize.value,
          budjet: budjet.value,
          time: time.value,
          files: files.value,
          expected_delivery_time: time.value,
        });
        if (response.isSuccess()) {
          console.log(response.value);
          toastManager?.value.alertSuccess("Job post updated successfuly");
          setTimeout(() => {
            window.location.href = "/my_jobs";
          }, 2000);
        }
      } catch (err: any) {
        toastManager?.value.alertError(err.response.data.messages);
        console.log(err.response.data.messages);
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
      onSubmit,
      cancelOperation,
      categories,
      addSkill,
    };
  },
};
