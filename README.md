# ZUID ClickUp Dashboards

Deze repository draait op de Next.js app in `dashboard/` (poort `3000`).

## Run lokaal

```bash
cd dashboard
npm install
npm run dev
```

Open daarna `http://localhost:3000`.

## Vereiste environment variables

Voor authentication (Auth.js) moet je in productie minimaal een secret en Google OAuth credentials zetten:

```bash
AUTH_SECRET=een-lange-random-string
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
```

Compatibiliteit: `NEXTAUTH_SECRET` werkt ook als fallback voor `AUTH_SECRET`.

## Data sync

De data cache wordt lokaal bijgewerkt met:

```bash
cd dashboard
node sync.mjs
```

Dit schrijft naar `dashboard/data/clickup-cache.json`.

## ZUID ClickUp structuur

| Space | Doel |
|-------|------|
| **Growth** | Interne projecten met budgetgoedkeuring van Ops manager |
| **Delivery** | Klantwerk — waar omzet wordt gegenereerd |
| **Operations** | Doorlopend intern werk (management, HR, finance) |
| **Overview** | Overzicht van klanten, projecten en schattingen |
