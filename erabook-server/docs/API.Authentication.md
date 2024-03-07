## `POST` **/auth/login**

### Login

<details>
<summary>Accept</summary>

```ts
{
    username: string,
    password: string,
}
```

</details>
<details>
<summary>Return</summary>

```ts
{
    accessToken: string,
    refreshToken: string
}
```

</details>

## `POST` **/auth/register**

### Registration

<details>
<summary>Accept</summary>

```ts
{
    username: string,
    emailAddress: string,
    password: string,

    // account setup fields
    ageGroup?:{
        from?: number,
        to?: number
    }
}
```

</details>
<details>
<summary>Return</summary>

```ts
{
    accessToken: string,
    refreshToken: string
}
```

</details>

## `POST` **/auth/renew**

### Session renewal

<details>
<summary>Accept</summary>

```ts
{
	refreshToken: string;
}
```

</details>
<details>
<summary>Return</summary>

```ts
{
    accessToken: string,
    refreshToken: string
}
```

</details>

## `POST` **/auth/recoverySendMail**

### Password recovery / Mail verification - send code

<details>
<summary>Accept</summary>

```ts
{
	emailAddress: string;
}
```

</details>

## `POST` **/auth/recoveryVerify**

### Password recovery / Mail verification - verify code

<details>
<summary>Accept</summary>

```ts
{
    emailAddress: string,
    code: string
}
```

</details>
<details>
<summary>Return</summary>

```ts
{
	isVerified: boolean;
}
```

</details>

## `POST` **/auth/recoveryUpdate**

### Password recovery - update password here

<details>
<summary>Accept</summary>

```ts
{
    emailAddress: string,
    code: string,
    password: string
}
```

</details>

## `GET` **/auth/logout**

### Session termination, logout

Nothing needed, just pass the **Bearer token header**
