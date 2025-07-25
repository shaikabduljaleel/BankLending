def combine_lists(list1, list2):
    combined = sorted(list1 + list2, key=lambda x: x['positions'][0])
    result = []
    for item in combined:
        if not result:
            result.append(item)
        else:
            prev = result[-1]
            l1, r1 = prev['positions']
            l2, r2 = item['positions']
            # check overlap condition
            len1 = r1 - l1
            len2 = r2 - l2
            overlap = max(0, min(r1, r2) - max(l1, l2))
            if overlap >= min(len1, len2) / 2:
                # Merge values
                prev['values'].extend(item['values'])
                prev['positions'][1] = max(r1, r2)
            else:
                result.append(item)
    return result

# Example
list1 = [{"positions": [0, 5], "values": [1, 2, 3]}]
list2 = [{"positions": [3, 8], "values": [4, 5]}]
print(combine_lists(list1, list2))
