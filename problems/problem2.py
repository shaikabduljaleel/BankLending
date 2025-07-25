def format_indian_currency(amount):
    integer, dot, fraction = str(amount).partition('.')
    if len(integer) > 3:
        start = integer[:-3]
        end = integer[-3:]
        start = ','.join([start[max(i - 2, 0):i] for i in range(len(start), 0, -2)][::-1])
        integer = start + ',' + end
    return integer + (dot + fraction if fraction else '')

# Example
print(format_indian_currency(123456.7891))  # Output: 1,23,456.7891
