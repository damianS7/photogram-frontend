<script setup lang="ts">
import { reactive, ref } from "vue";
import { SquarePen, Save, SaveOff } from "lucide-vue-next";
const newPassword = ref("");
const repeatedPassword = ref("");
const emit = defineEmits(["update", "close"]);

const props = defineProps<{
  index: number;
  field: {
    name: string;
    value: string;
    placeholder: string;
    type: string;
    error: string;
    isEditing: boolean;
    edited: boolean;
    options?: Array<{ label: string; value: string }>;
  };
}>();

const formField = reactive({
  name: props.field.name,
  value: props.field.value,
  placeholder: props.field.placeholder,
  type: props.field.type,
  error: props.field.error,
  isEditing: props.field.isEditing,
  edited: props.field.edited,
  options: props.field?.options,
  // validation
});

function updateField() {
  emit("update", props.index, {
    name: formField.name,
    value: formField.value,
  });
}

function updatePassword() {
  // password does not match!
  if (newPassword.value !== repeatedPassword.value) {
    formField.error = "Password does not match!";
    return;
  }

  emit("update", props.index, {
    name: formField.name,
    value: newPassword.value,
  });

  formField.isEditing = false;
}
</script>
<template>
  <div
    v-if="formField.type !== 'select' && formField.type !== 'password'"
    class="p-4 bg-white rounded border shadow-sm"
  >
    <div>
      <p class="text-gray-500 text-sm">{{ formField.placeholder }}</p>

      <div
        v-if="!formField.isEditing"
        class="flex items-center justify-between font-medium text-lg"
      >
        <span class="truncate">{{ props.field.value }}</span>
        <SquarePen class="text-blue-500 cursor-pointer" @click="formField.isEditing = true" />
      </div>

      <div v-else class="flex flex-col gap-2 md:flex-row md:items-center">
        <input :type="formField.type" class="border rounded p-2 w-full" v-model="formField.value" />
        <div class="flex gap-2 justify-end md:justify-start">
          <Save
            class="text-green-500 cursor-pointer"
            @click="
              () => {
                formField.isEditing = false;
                updateField();
              }
            "
          />
          <SaveOff class="text-red-500 cursor-pointer" @click="formField.isEditing = false" />
        </div>
      </div>

      <p class="text-red-500 text-sm mt-1">
        {{ formField?.error }}
      </p>
    </div>
  </div>

  <div v-if="formField.type === 'select'" class="bg-white p-4 rounded border shadow-sm">
    <p class="text-sm text-gray-500">{{ formField.placeholder }}</p>

    <div v-if="!formField.isEditing" class="flex justify-between items-center text-lg">
      <span>{{ props.field.value }}</span>
      <SquarePen class="text-blue-500 cursor-pointer" @click="formField.isEditing = true" />
    </div>

    <div v-else class="flex flex-col md:flex-row gap-2 items-center">
      <select v-model="formField.value" :name="formField.name" class="border rounded p-2 w-full">
        <option v-for="option in formField.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="flex gap-2 justify-end md:justify-start">
        <Save
          class="text-green-500 cursor-pointer"
          @click="
            () => {
              formField.isEditing = false;
              updateField();
            }
          "
        />
        <SaveOff class="text-red-500 cursor-pointer" @click="formField.isEditing = false" />
      </div>
    </div>

    <p class="text-red-500 text-sm mt-1">{{ formField?.error }}</p>
  </div>

  <div
    class="p-4 bg-white rounded border shadow-sm sm:col-span-2"
    v-if="formField.type == 'password'"
  >
    <p class="text-gray-500 text-sm">{{ formField.placeholder }}</p>

    <div v-if="!formField.isEditing" class="flex items-center justify-between font-medium text-lg">
      <span>{{ props.field.value }}</span>
      <SquarePen class="text-blue-500 cursor-pointer" @click="formField.isEditing = true" />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
      <div class="w-full">
        <input
          :type="formField.type"
          name="new-password"
          placeholder="Your new password"
          v-model="newPassword"
          class="border rounded p-2 w-full"
        />
      </div>

      <div class="w-full">
        <input
          :type="formField.type"
          placeholder="Repeat new password"
          name="repeat-password"
          v-model="repeatedPassword"
          class="border rounded p-2 w-full"
        />
      </div>
      <div class="flex justify-end items-center">
        <Save
          class="text-green-500 cursor-pointer"
          @click="
            () => {
              updatePassword();
            }
          "
        />
        <SaveOff class="text-red-500 cursor-pointer" @click="formField.isEditing = false" />
      </div>
    </div>

    <p class="text-red-500 text-sm mt-1">{{ formField?.error }}</p>
  </div>
</template>
