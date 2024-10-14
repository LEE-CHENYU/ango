### Build the Docker Image for the Correct Architecture (linux/amd64):

   ```bash
   docker buildx build --platform=linux/amd64 -t gcr.io/ango-438501/ango-backend:latest --push .
   ```

### Deploy to Cloud Run:

   ```bash
   gcloud run deploy ango-backend \
       --image gcr.io/ango-438501/ango-backend:latest \
       --platform managed \
       --region us-central1 \
       --allow-unauthenticated \
       --set-env-vars="DATABASE_URL=postgres://ua8l0f1pbq6fru:pf72e062a724c1649609743026782f72c8d7bd60776a5ec5474d5e9a31dac8ce2@c3cj4hehegopde.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d4qalpraoaames"
   ```