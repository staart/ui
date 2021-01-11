<script lang="ts">
  import { stores } from "@sapper/app";
  import { saveAs } from "file-saver";
  import { onMount } from "svelte";
  import { api } from "../../../api";
  import Error from "../../../components/Error.svelte";
  import Form from "../../../components/Form.svelte";
  import { languages } from "../../../data";
  import { activeNotification, users } from "../../../stores";

  const { page } = stores();
  const { slug } = $page.params;
  let state = "ready";
  let error = "";
  let data: any = {};

  onMount(() => {
    fetch();
  });

  const fetch = async () => {
    state = "fetching";
    try {
      data = await api<any>({
        method: "GET",
        url: `/users/${slug}`,
        onCachedResponse: (result) => (data = result),
      });
      error = "";
    } catch (err) {
      error = err.message;
    }
    state = "ready";
  };

  const edit = async (body: {
    name: string;
    gender: string;
    prefersLanguage: string;
    prefersColorScheme: string;
    prefersReducedMotion: string;
    profilePictureFile?: File;
    identificationFile?: File;
  }) => {
    if (body.profilePictureFile) {
      const files = body.profilePictureFile;
      const formData = new FormData();
      formData.append("files", files[0]);
      await api<any>({
        method: "POST",
        url: `/users/${slug}/profile-picture`,
        body: formData,
        formData: true,
      });
      activeNotification.set({
        text: "Profile picture been uploaded",
        type: "success",
      });
    }
    if (body.identificationFile) {
      const files = body.identificationFile;
      const formData = new FormData();
      formData.append("files", files[0]);
      await api<any>({
        method: "POST",
        url: `/users/${slug}/identification`,
        body: formData,
        formData: true,
      });
      activeNotification.set({
        text: "Identification document been uploaded",
        type: "success",
      });
    }
    delete body.profilePictureFile;
    delete body.identificationFile;
    data = await api<any>({
      method: "PATCH",
      url: `/users/${slug}`,
      body,
    });
    error = "";
    activeNotification.set({
      text: "Your profile has been updated",
      type: "success",
    });
    users.update((items) => {
      items = items.map((i) => {
        if (i.details.id === data.id) return { ...i, details: data };
        return i;
      });
      return items;
    });
  };

  const download = async () => {
    const name = ((data.attributes || {}).idDocumentUrl || "").split("/").pop();
    const blob = await api<Blob>({
      method: "GET",
      url: `/users/${slug}/identification`,
      blob: true,
    });
    saveAs(blob, name);
  };
</script>

<svelte:head>
  <title>Profile</title>
</svelte:head>

<div class="p-7">
  <h1 class="text-2xl">Profile</h1>
  {#if error}
    <Error {error} />
  {/if}
  {#if state === 'fetching'}
    <div class={`loading ${data ? 'loading-has' : 'h-52 bg-gray-50'}`} />
  {/if}
  <Form
    items={[{ name: 'name', label: 'Name', autocomplete: 'name', required: true }, { name: 'profilePictureFile', label: 'Profile picture', type: 'image', preview: data.profilePictureUrl }, { name: 'identificationFile', label: 'Identification document', type: 'file', preview: (data.attributes || {}).idDocumentUrl, accept: 'image/*,.pdf', hint: 'Select an image or scanned PDF up to 25 MB in size', download }, { name: 'gender', label: 'Gender', autocomplete: 'sex', required: true, type: 'enum', options: { FEMALE: 'Female', MALE: 'Male', NONBINARY: 'Nonbinary', UNKNOWN: 'Prefer not to say' } }, { name: 'prefersLanguage', label: 'Language', required: true, type: 'enum', options: languages }, { name: 'prefersColorScheme', label: 'Color scheme', required: true, type: 'enum', options: { LIGHT: 'Light', DARK: 'Dark', NO_PREFERENCE: 'No preference' } }, { name: 'prefersReducedMotion', label: 'Preferred motion', required: true, type: 'enum', options: { REDUCE: 'Reduced motion', NO_PREFERENCE: 'No preference' } }]}
    values={data}
    submitText="Save profile"
    onSubmit={edit} />
</div>
