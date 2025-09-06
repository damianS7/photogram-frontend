<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import type { GenderType } from "@/types/Profile";
import type { CustomerRegistration } from "@/types/CustomerRegistration";
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const genderTypes: GenderType[] = ["MALE", "FEMALE"];

const genderOptions = genderTypes.map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));

// convertir array a objeto plano
function getFormData() {
  return formFields.value.reduce(
    (acc, field) => {
      acc[field.name] = field.value;
      return acc;
    },
    {} as Record<string, string>
  );
}

function redirectBackToLastPage() {
  const redirectPath = route.query.redirect?.toString() || "/auth/login";
  router.push(redirectPath);
}

// Check if the user is already authenticated
if (authStore.isAuthenticated) {
  redirectBackToLastPage();
}

const formStatus = ref({
  message: "",
  status: "",
});

const formFields = ref([
  { name: "email", type: "email", placeholder: "Email", value: "", error: "" },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    value: "",
    error: "",
  },
  {
    name: "username",
    type: "text",
    placeholder: "Your @username",
    value: "",
    error: "",
  },
  {
    name: "firstname",
    type: "text",
    placeholder: "First name",
    value: "",
    error: "",
  },
  {
    name: "lastname",
    type: "text",
    placeholder: "Last name",
    value: "",
    error: "",
  },
  { name: "phone", type: "text", placeholder: "Phone", value: "", error: "" },
  {
    name: "gender",
    type: "select",
    placeholder: "Gender",
    value: "",
    options: genderOptions,
    error: "",
  },
  {
    name: "birthdate",
    type: "date",
    placeholder: "Birthdate",
    value: "",
    error: "",
  },
]);

const resolver = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  gender: z.enum(["MALE", "FEMALE"], {
    errorMap: () => ({ message: "Invalid gender" }),
  }),
});

const onFormSubmit = async () => {
  const formData = getFormData();
  const result = resolver.safeParse(formData);
  formFields.value.forEach((f) => (f.error = ""));

  if (!result.success) {
    const fieldErrors: any = result.error.flatten().fieldErrors;

    formFields.value.forEach((field) => {
      if (fieldErrors[field.name]) {
        field.error = fieldErrors[field.name];
      }
    });
    return;
  }

  const customer: CustomerRegistration = {
    email: formData.email,
    password: formData.password,
    username: formData.username,
    firstName: formData.firstname,
    lastName: formData.lastname,
    phone: formData.phone,
    birthdate: formData.birthdate,
    gender: formData.gender as GenderType,
  };

  await authStore
    .register(customer)
    .then(() => {
      formStatus.value.message = "User registered.";
    })
    .catch((error) => {
      formStatus.value.message = error.message;
    });
};
</script>
<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <form :resolver="resolver" @submit.prevent="onFormSubmit" class="flex flex-col gap-4">
      <div v-for="(field, index) in formFields" :key="index" class="flex flex-col gap-1">
        <input
          v-if="field.type !== 'select'"
          v-model="field.value"
          :name="field.name"
          :type="field.type"
          :placeholder="field.placeholder"
          class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          v-if="field.type === 'select'"
          v-model="field.value"
          :name="field.name"
          class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option v-for="option in field.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <span v-if="field?.error" class="text-sm text-red-500">{{ field.error[0] }}</span>
      </div>
      <div v-if="formStatus.message" class="flex flex-col gap-1">
        <span
          :class="[
            'flex items-center border px-4 py-3 rounded relative',
            formStatus.status === '201' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100',
          ]"
          >{{ formStatus.message }}</span
        >
      </div>
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Register
      </button>
    </form>
  </div>
</template>
