FROM node:18-alpine AS build
WORKDIR /app
COPY apps/app/package.json yarn.lock* ./
RUN yarn cache clean
RUN wget -q --spider http://google.com && echo "Network is up" || echo "Network is down"
COPY apps/shared-types ../shared-types
COPY apps/app ./
RUN yarn install --network-timeout 1000000
ENV NODE_ENV=production
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_RAZORPAY_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_RAZORPAY_KEY=$NEXT_PUBLIC_RAZORPAY_KEY
RUN yarn build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/next.config.mjs ./
EXPOSE 3000
CMD ["yarn", "start"]