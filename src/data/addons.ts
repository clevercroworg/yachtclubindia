export type AddonDefinition = {
  id: string;
  label: string;
  price: number;
};

export const ADDONS: AddonDefinition[] = [
  { id: 'balloon-decor', label: 'Balloon decor', price: 1500 },
  { id: 'drone-shoot', label: 'Drone shoot videography and photography', price: 3500 },
  { id: 'pre-wedding-shoot', label: 'Pre wedding or professional shoot', price: 10000 },
  { id: 'dj-music', label: 'DJ / Music Setup', price: 7000 },
  { id: 'dining-setup', label: 'Premium Dining Setup', price: 10000 },
];

export const getAddonById = (id: string) => ADDONS.find((addon) => addon.id === id);
