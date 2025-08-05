<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { Save } from "lucide-vue-next";
import Alert from "@/components/Alert.vue";
import { computed, onMounted, ref } from "vue";
import ProfileEditableField from "./components/ProfileEditableField.vue";
import ProfilePhoto from "./components/ProfilePhotoUploader.vue";
import type { GenderType } from "@/types/Profile";
import { AlertType } from "@/types/AlertType";
import { useModalStore } from "@/stores/modal";
const modalStore = useModalStore();
const customerStore = useCustomerStore();
const customer = customerStore.getLoggedCustomer;
const genderTypes: GenderType[] = ["MALE", "FEMALE"];
const genderOptions = genderTypes.map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));
// TODO add zod validation
// message to show
const alert = ref();
const customerProfile = computed(() => customerStore.customer.profile);
console.log("Customer Profile:", customerProfile.value?.firstName);
// updatable fields to be displayed
const formFields = ref([
  {
    name: "firstName",
    type: "text",
    placeholder: "First name",
    value: customerProfile.value?.firstName,
    error: "",
    isEditing: false,
    edited: false,
    // validation: zod
  },
  {
    name: "lastName",
    type: "text",
    placeholder: "Last name",
    value: customerProfile.value?.lastName,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email",
    value: customer.email,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "phone",
    type: "text",
    placeholder: "Phone",
    value: customerProfile.value?.phone,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "gender",
    type: "select",
    placeholder: "Gender",
    value: customerProfile.value?.gender,
    options: genderOptions,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "birthdate",
    type: "date",
    placeholder: "Birthdate",
    value: customerProfile.value?.birthdate,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "password",
    type: "password",
    placeholder: "New password",
    value: "*********",
    error: "",
    isEditing: false,
    edited: false,
  },
]);

// update a single field
async function updateField(index: number, field: { name: string; value: string }) {
  // updating email requires a different method
  if (field.name == "email") {
    updateEmail(index, field.value);
    return;
  }

  // updating password requires a different method
  if (field.name == "password") {
    updatePassword(field.value);
    return;
  }

  // wait for the user to input his password
  const currentPassword = (await modalStore.open("ConfirmPasswordModal", {
    title: "Confirm Password",
  })) as string;

  if (!currentPassword) {
    // user cancelled the modal
    return;
  }

  // nothing to update
  if (field.value.length == 0 || currentPassword.length == 0) {
    return;
  }

  // request for update
  await customerStore
    .updateProfile(currentPassword, {
      [field.name]: field.value,
    })
    .then((profile: any) => {
      // FIXME profile not returning nothing ... see store
      console.log("Profile updated:", profile);
      // customerStore.setProfile(profile);
      formFields.value[index].value = field.value;
      alert.value.showMessage("Field successfully updated.", AlertType.SUCCESS);
    })
    .catch((error) => {
      alert.value.showMessage(error.message, AlertType.ERROR);
    });
}

// change the password
async function updatePassword(newPassword: string) {
  // wait for the user to input his password
  const currentPassword = (await modalStore.open("ConfirmPasswordModal", {
    title: "Confirm Password",
  })) as string;

  // nothing to update
  if (currentPassword.length == 0 || newPassword.length == 0) {
    return;
  }

  // request for update
  await customerStore
    .changePassword(currentPassword, newPassword)
    .then(() => {
      alert.value.showMessage("Password successfully updated.", AlertType.SUCCESS);
    })
    .catch((error) => {
      alert.value.showMessage(error.message, AlertType.ERROR);
    });
}

// update profile photo
async function updatePhoto(photo: any) {
  // wait for the user to input his password
  const password = (await modalStore.open("ConfirmPasswordModal", {
    title: "Confirm Password",
  })) as string;

  // if password is not set
  if (password.length == 0) {
    return;
  }

  await customerStore
    .uploadPhoto(password, photo)
    .then((blob) => {
      localStorage.setItem("profilePhotoURL", URL.createObjectURL(blob));
      customerStore.setPhoto(".");
      alert.value.showMessage("Photo successfully updated.", AlertType.SUCCESS);
    })
    .catch((error) => {
      alert.value.showMessage(error.message, AlertType.ERROR);
    });
}

// update email field
async function updateEmail(index: number, newEmail: string) {
  await modalStore.open("confirmModal", {
    title: "Confirm Email Change",
    message: "Session will be closed after you change your email.",
  });

  // wait for the user to input his password
  const currentPassword = (await modalStore.open("ConfirmPasswordModal", {
    title: "Confirm Password",
  })) as string;

  // nothing to update
  if (newEmail.length == 0 || currentPassword.length == 0) {
    return;
  }

  // request for update
  await customerStore
    .patchEmail(currentPassword, newEmail)
    .then((customer) => {
      customerStore.setEmail(customer.email);
      formFields.value[index].value = newEmail;
      alert.value.showMessage("Field successfully updated.", AlertType.SUCCESS);
    })
    .catch((error) => {
      alert.value.showMessage(error.message, AlertType.ERROR);
    });
}
onMounted(() => {});
</script>
<template>
  <div class="grid h-full overflow-hidden">
    <section
      class="sm:flex items-center justify-between text-xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Profile</h1>
      <button class="btn btn-xs btn-primary">
        <Save :size="18" />
      </button>
    </section>

    <section class="overflow-scroll h-full">
      <Alert class="mb-4" ref="alert" />
      <div class="flex justify-center">
        <ProfilePhoto @update="updatePhoto" />
      </div>
      <div v-if="customerProfile" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileEditableField
          v-for="(field, index) in formFields"
          :key="index"
          :index="index"
          :field="field"
          @update="updateField"
        />
      </div>
    </section>
  </div>
</template>
