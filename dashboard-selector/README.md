# Dashboard Widget Selector - Deployment Instructions

## Overview

This implements a dropdown selector system for the MXWLL dashboard that allows users to switch between curated widget collections. Selection is persisted in localStorage.

## Files to Deploy

### New Files (create these)

```
src/lib/dashboard/
├── index.ts              # Re-exports for cleaner imports
├── widget-registry.ts    # All widget definitions
├── widget-sets.ts        # Curated set configurations
├── storage.ts            # localStorage utilities
└── widget-components.ts  # Component mapping

src/components/
└── DashboardSelector.tsx # The dropdown component
```

### Files to Replace

```
src/app/observe/dashboard/page.tsx  # Updated to use dynamic rendering
```

## Deployment Steps

1. **Create the lib/dashboard directory** if it doesn't exist:
   ```bash
   mkdir -p src/lib/dashboard
   ```

2. **Copy all files from src/lib/dashboard/** to your project's `src/lib/dashboard/`

3. **Copy DashboardSelector.tsx** to your project's `src/components/`

4. **Replace page.tsx** - Back up your existing `src/app/observe/dashboard/page.tsx` then replace it with the new version

5. **Verify imports** - Ensure all widget component imports in `widget-components.ts` match your actual file paths. Some may need adjustment:
   - Check if files are named `eBirdLive.tsx` vs `EBirdLive.tsx`
   - Check if files are named `iNaturalistLive.tsx` vs `INaturalistLive.tsx`

6. **Test locally**:
   ```bash
   npm run dev
   ```
   Then visit `/observe/dashboard` and verify:
   - Dropdown appears below the description
   - Switching sets changes the visible widgets
   - Selection persists on page refresh

## Configuration

### Widget Sets

Edit `src/lib/dashboard/widget-sets.ts` to modify:
- Which widgets appear in each set
- Set names and descriptions
- Add/remove sets

### Widget Definitions

Edit `src/lib/dashboard/widget-registry.ts` to:
- Add new widgets
- Update descriptions/sources
- Change categories

### Future: Clerk Integration

When adding user auth:
1. Import `useUser` from `@clerk/nextjs` in the page
2. Pass `isRegistered={!!user}` to DashboardSelector
3. For registered users, store preferences in Clerk metadata instead of localStorage

## Troubleshooting

**Widgets not rendering?**
- Check browser console for "Widget not found" or "Component not found" warnings
- Verify the widget ID in the set matches a key in WIDGET_REGISTRY
- Verify the component name matches a key in WIDGET_COMPONENTS

**Hydration errors?**
- The `isClient` state guards against localStorage access during SSR
- If issues persist, ensure the selector only renders after mount

**Selection not persisting?**
- Check localStorage in browser DevTools (Application > Local Storage)
- Look for key: `mxwll-dashboard-set`
