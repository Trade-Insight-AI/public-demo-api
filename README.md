# Generate JWT Private Public PEM files

```bash
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
```

```bash
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

## Convert files pem to base64

```bash
base64 -i ./private_key.pem -o private_key_base64.txt
```

```bash
base64 -i ./public_key.pem -o public_key_base64.txt
```
