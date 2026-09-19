import re

with open('src/lib/server/fetchPropertyById.ts', 'r') as f:
    content = f.read()

# Replace for fetchPropertyByIdServer
content = re.sub(
    r'(fetchPropertyByIdServer.*?)next: { revalidate: 3600 },',
    r"\1next: { revalidate: 3600, tags: ['properties-list', 'properties', `property-${trimmed}`] },",
    content,
    flags=re.DOTALL
)

# Replace for fetchPropertyBySlugServer
content = re.sub(
    r'(fetchPropertyBySlugServer.*?)next: { revalidate: 3600 },',
    r"\1next: { revalidate: 3600, tags: ['properties-list', 'properties', `property-${trimmedSlug}`] },",
    content,
    flags=re.DOTALL
)

# Replace for fetchPublicPropertyBySlugServer
content = re.sub(
    r'(fetchPublicPropertyBySlugServer.*?)next: { revalidate: 3600 },',
    r"\1next: { revalidate: 3600, tags: ['properties-list', 'properties', `property-${trimmedSlug}`] },",
    content,
    flags=re.DOTALL
)

with open('src/lib/server/fetchPropertyById.ts', 'w') as f:
    f.write(content)

print("Patched!")
