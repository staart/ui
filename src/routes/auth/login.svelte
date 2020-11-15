<script lang="ts">
  import {
    Button,
    Form,
    FormGroup,
    TextInput,
    PasswordInput,
    InlineNotification,
  } from "carbon-components-svelte";
  import { api } from "../../helpers/api";

  let email = "";
  let password = "";
  let errorMessage = "";

  const login = async () => {
    try {
      const response = await api("POST", "/auth/login");
      console.log(response);
    } catch (err) {
      errorMessage = err.message;
      password = "";
    }
  };
</script>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

<Form on:submit={login}>
  <FormGroup>
    <TextInput type="email" labelText="Email" bind:value={email} required />
  </FormGroup>
  <FormGroup>
    <PasswordInput labelText="Password" bind:value={password} />
  </FormGroup>
  <Button type="submit">Login to your account</Button>
</Form>
