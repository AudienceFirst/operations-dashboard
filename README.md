# ZUID ClickUp Dashboards

Deze repository draait op de Next.js app in `dashboard/` (poort `3000`).

## Run lokaal

```bash
cd dashboard
npm install
npm run dev
```

Open daarna `http://localhost:3000`.

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
