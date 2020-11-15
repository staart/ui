<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    Select,
    SelectItem,
    Form,
    FormGroup,
    InlineLoading,
    RadioButton,
    RadioButtonGroup,
    TextInput,
    Checkbox,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { api } from "../../../helpers/api";

  const { page } = stores();
  const { id } = $page.params;

  let profile: any = null;
  let loading = true;
  let state = "ready";
  onMount(async () => {
    profile = await api("GET", `/users/${id}`);
    loading = false;
  });

  const save = async () => {
    state = "saving";
    profile = await api("PATCH", `/users/${id}`, {
      name: profile.name,
      gender: profile.gender,
      prefersLanguage: profile.prefersLanguage,
      countryCode: profile.countryCode,
      timezone: profile.timezone,
      checkLocationOnLogin: profile.checkLocationOnLogin,
      prefersColorScheme: profile.prefersColorScheme,
      prefersReducedMotion: profile.prefersReducedMotion,
    });
    state = "saved";
    setTimeout(() => (state = "ready"), 5000);
  };
</script>

<h1>Profile</h1>

{#if loading}
  <InlineLoading description="Loading profile..." />
{:else if profile}
  <Form on:submit={save}>
    <FormGroup>
      <TextInput labelText="Name" bind:value={profile.name} required />
    </FormGroup>
    <FormGroup legendText="Gender pronoun">
      <RadioButtonGroup bind:selected={profile.gender}>
        <RadioButton value="FEMALE" labelText="Female (her/her)" />
        <RadioButton value="MALE" labelText="Male (his/him)" />
        <RadioButton value="NONBINARY" labelText="Nonbinary (they/them)" />
        <RadioButton
          value="UNKNOWN"
          labelText="Prefer not to say (they/them)" />
      </RadioButtonGroup>
    </FormGroup>
    <FormGroup>
      <Select labelText="Language" bind:selected={profile.prefersLanguage}>
        <SelectItem value="en-us" text="English (United States)" />
        <SelectItem value="en-in" text="English (India)" />
        <SelectItem value="nl-nl" text="Dutch (The Netherlands)" />
      </Select>
    </FormGroup>
    <FormGroup>
      <Select labelText="Country" bind:selected={profile.countryCode}>
        <SelectItem value="us" text="United States" />
        <SelectItem value="in" text="India" />
        <SelectItem value="nl" text="The Netherlands" />
        <SelectItem value="xx" text="Other" />
      </Select>
    </FormGroup>
    <FormGroup>
      <Select labelText="Timezone" bind:selected={profile.timezone}>
        <SelectItem value="America/Los_Angeles" text="America/Los Angeles" />
      </Select>
    </FormGroup>
    <FormGroup legendText="Security settings">
      <Checkbox
        bind:checked={profile.checkLocationOnLogin}
        labelText="Verify my device location when I login" />
    </FormGroup>
    <FormGroup legendText="Preferred color scheme">
      <RadioButtonGroup bind:selected={profile.prefersColorScheme}>
        <RadioButton value="LIGHT" labelText="Light" />
        <RadioButton value="DARK" labelText="Dark" />
        <RadioButton value="NO_PREFERENCE" labelText="Use device settings" />
      </RadioButtonGroup>
    </FormGroup>
    <FormGroup legendText="Preferred motion">
      <RadioButtonGroup bind:selected={profile.prefersReducedMotion}>
        <RadioButton value="REDUCE" labelText="Reduce motion" />
        <RadioButton value="NO_PREFERENCE" labelText="Allow animations" />
      </RadioButtonGroup>
    </FormGroup>
    <Button type="submit">Save profile</Button>
  </Form>
  {#if state === 'saving'}
    <InlineLoading status="active" description="Saving..." />
  {:else if state === 'saved'}
    <InlineLoading status="finished" description="Success" />
  {/if}
{/if}
