def caesar_cipher(message, shift, mode='encode'):
    result = ''
    if mode == 'decode':
        shift = -shift
    for char in message:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            new_char = chr((ord(char) - base + shift) % 26 + base)
            result += new_char
        else:
            result += char
    return result

# Example
msg = "Hello World"
encoded = caesar_cipher(msg, 3)
decoded = caesar_cipher(encoded, 3, mode='decode')
print("Encoded:", encoded)
print("Decoded:", decoded)
