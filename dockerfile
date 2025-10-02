###############
# Build stage #
###############
FROM node:24-alpine AS builder

WORKDIR /app

# Install deps (use yarn since yarn.lock exists)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy Prisma schema for client generation
COPY prisma ./prisma

# Generate Prisma Client (runs also on @prisma/client postinstall, but explicit is fine)
RUN yarn prisma generate || true

# Copy the rest of the source and build
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

RUN yarn build

#################
# Runtime stage  #
#################
FROM node:24-alpine AS runner

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Prisma on Alpine may require openssl
RUN apk add --no-cache openssl

# Copy only necessary files
COPY package.json yarn.lock ./

# Install only production dependencies without running postinstall scripts
# (we copy generated Prisma artifacts from builder instead)
RUN yarn install --frozen-lockfile --production=true --ignore-scripts \
    && yarn cache clean

# Copy Prisma schema (optional, useful if you run migrations externally)
COPY prisma ./prisma

# Ensure generated Prisma client from builder is available in runtime
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built files
COPY --from=builder /app/dist ./dist

# Use the node user for security
USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]


