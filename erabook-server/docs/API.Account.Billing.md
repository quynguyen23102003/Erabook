## `POST` **/account/billing/addPaymentMethod**

### Add a payment method

`Note` Will return matching current user's existing payment method ID if the payment method has matching card number and owner, else return undefined.

#### yes this is scuffed

<details>
<summary>Accept</summary>

```ts
{
    _type: "gpay" | "momo" | "visa" | "mastercard" | "zalopay",
    bankName: string,

    cardNumber: string,
    cardHolderName: string,
    cardSecret: string,
    cardExpiration: string
}
```

</details>

<details>
<summary>Return</summary>

```ts
{
	_id: string; // id of matching user's existing payment method, if found, else undefined
}
```

</details>

## `DELETE` **/account/billing/removePaymentMethod**

### Remove a payment method

<details>
<summary>Accept</summary>

```ts
{
	_id: string; // ID of an existing payment method
}
```

</details>

## `GET` **/account/billing/getPaymentMethods**

### Get all available payment methods

<details>
<summary>Return</summary>

```ts
[
    {
        _id: string,
        _type: "gpay" | "momo" | "visa" | "mastercard" | "zalopay",
        bankName: string,

        cardNumber: string,
        cardHolderName: string,
        cardExpiration: string
    },
    {
        ...
    }
]
```

</details>

## `POST` **/account/billing/updatePaymentMethod**

### Update a payment method

<details>
<summary>Accept</summary>

```ts
{
    _id: string,
    _type: "gpay" | "momo" | "visa" | "mastercard" | "zalopay",
    bankName: string,

    cardNumber: string,
    cardSecret: string
    cardHolderName: string,
    cardExpiration: string
}
```

</details>

## `GET` **/account/billing/history**

### Get a list of purchase history (does not included books marked for removal)

#### for now the `status` will always return "success"

<details>
<summary>Return</summary>

```ts
[
    {
        _id: string,
        status: "success" | "ongoing" | "cancelled",
        paymentMethod: {
            _id: string,
            _type: string,
            bankName?: string,
            cardNumber: string,
        },
        books: [
            {
                ...book_model // see API.Books.md
            },
            {
                ...
            }
        ]
    },
    {
        ...
    }
]
```

</details>

## `POST` **/account/billing/purchase**

### Purchase one or multiple books

This one is scuffed

<details>
<summary>Accept</summary>

```ts
{
    _bookIds: string[],
    _paymentMethodId: string
}
```

</details>
