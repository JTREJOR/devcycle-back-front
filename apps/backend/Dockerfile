FROM node:20-slim AS base
RUN corepack enable
WORKDIR /repo

FROM base AS deps
COPY pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/backend/package.json apps/backend/package.json
RUN pnpm install --frozen-lockfile=false

FROM deps AS build
COPY packages/shared packages/shared
COPY apps/backend apps/backend
RUN pnpm --filter @devcycle/shared build
RUN pnpm --filter backend build

FROM node:20-slim AS runner
RUN corepack enable
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/pnpm-workspace.yaml /repo/package.json ./
COPY --from=build /repo/packages/shared/package.json packages/shared/package.json
COPY --from=build /repo/packages/shared/dist packages/shared/dist
COPY --from=build /repo/apps/backend/package.json apps/backend/package.json
COPY --from=build /repo/apps/backend/dist apps/backend/dist
RUN pnpm install --prod --frozen-lockfile=false
ENV PORT=8080
EXPOSE 8080
CMD ["node", "apps/backend/dist/main.js"]
