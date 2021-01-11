<script lang="ts">
  import { api } from "../../api";
  import Form from "../../components/Form.svelte";
  import Success from "../../components/Success.svelte";
  import type { User } from "../../stores";

  let done = false;
  const resend = async (data: Record<string, string>) => {
    await api<User["auth"]>({
      method: "POST",
      url: "/auth/resend-email-verification",
      body: {
        ...data,
        origin: window.location.origin,
      },
    });
    done = true;
  };
</script>

<svelte:head>
  <title>Resend email verification</title>
</svelte:head>

<div class="text-center">
  <h1 class="text-3xl font-bold">Resend email verification</h1>
</div>
{#if done}
  <Success title="Check your email">We've sent you a new link to verify your email</Success>
{:else}
  <Form
    items={[{ name: 'email', label: 'Email', type: 'email', required: true }]}
    submitText="Request email"
    onSubmit={resend} />
{/if}
