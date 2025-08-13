<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import Alert from "@/components/Alert.vue";
import { computed, ref } from "vue";
import { Save } from "lucide-vue-next";
import { AlertType } from "@/types/AlertType";
import { useModalStore } from "@/stores/modal";

// store
const modalStore = useModalStore();
const customerStore = useCustomerStore();

// data
const customer = customerStore.getLoggedCustomer;
// message to show
const alert = ref();
const customerProfile = computed(() => customerStore.customer.profile);

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
]);

// functions
// update a single field
async function updateField(index: number, field: { name: string; value: string }) {
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
  customerStore
    .updateProfile(currentPassword, {
      [field.name]: field.value,
    })
    .then((profile: any) => {
      formFields.value[index].value = field.value;
      alert.value.showMessage("Field successfully updated.", AlertType.SUCCESS);
    })
    .catch((error) => {
      alert.value.showMessage(error.message, AlertType.ERROR);
    });
}

function saveSettings() {
  //
}
</script>
<template>
  <div class="flex flex-col h-full overflow-hidden relative">
    <div class="absolute p-2 w-full">
      <Alert ref="alert" />
    </div>
    <section
      class="sm:flex items-center justify-between text-xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Notifications</h1>
      <button class="btn btn-xs btn-primary" @click="saveSettings">
        <Save :size="18" />
      </button>
    </section>

    <section class="overflow-scroll h-full p-4">
      <div class="flex justify-between w-full">
        <span>Enable notifications</span>
        <span>
          <select name="" id="">
            <option value="">Y</option>
            <option value="">N</option>
          </select>
        </span>
      </div>
    </section>
  </div>
</template>
