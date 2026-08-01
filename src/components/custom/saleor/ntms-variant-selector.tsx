import clsx from "clsx";
import type {
  NtmsSaleorProductVariant,
  NtmsSaleorVariantAttributeValue,
} from "@/lib/saleor/catalog";

export type NtmsSaleorVariantAttributeGroup = {
  id: string;
  name: string;
  slug: string;
  values: NtmsSaleorVariantAttributeValue[];
};

const naturalOrder = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

const preferredAttributeOrder = ["type", "gauge", "size"];

const colorSwatches: [RegExp, string][] = [
  [/black|jet|charcoal/i, "#171717"],
  [/white|clear/i, "#f8fafc"],
  [/silver|chrome/i, "#a8afb8"],
  [/gray|grey|smoke/i, "#737b86"],
  [/gold/i, "#bc8a26"],
  [/bronze|copper/i, "#a96032"],
  [/brown|tan|nude|beige/i, "#9f6a43"],
  [/red|crimson|scarlet/i, "#bd3439"],
  [/orange/i, "#d9762a"],
  [/yellow/i, "#e6bc35"],
  [/green|olive|lime/i, "#3c825e"],
  [/blue|cyan|teal/i, "#277eab"],
  [/purple|violet|lavender/i, "#8053a6"],
  [/pink|rose|magenta/i, "#c26089"],
];

export function getSaleorVariantAttributeGroups(
  variants: NtmsSaleorProductVariant[],
): NtmsSaleorVariantAttributeGroup[] {
  const groups = new Map<
    string,
    NtmsSaleorVariantAttributeGroup & { order: number }
  >();
  let order = 0;

  for (const variant of getSelectableVariants(variants)) {
    for (const attribute of variant.attributes) {
      if (attribute.values.length === 0) {
        continue;
      }
      const current = groups.get(attribute.id) ?? {
        id: attribute.id,
        name: attribute.name,
        slug: attribute.slug,
        values: [],
        order: order++,
      };
      const valueIds = new Set(current.values.map((value) => value.id));
      for (const value of attribute.values) {
        if (!valueIds.has(value.id)) {
          current.values.push(value);
          valueIds.add(value.id);
        }
      }
      groups.set(attribute.id, current);
    }
  }

  return [...groups.values()]
    .filter((group) => group.values.length > 1)
    .sort(
      (left, right) =>
        getAttributePriority(left.name) - getAttributePriority(right.name) ||
        left.order - right.order ||
        naturalOrder.compare(left.name, right.name),
    )
    .map(({ order: _order, ...group }) => ({
      ...group,
      values: [...group.values].sort((left, right) =>
        naturalOrder.compare(left.name, right.name),
      ),
    }));
}

export function getPreferredSaleorVariant(
  variants: NtmsSaleorProductVariant[],
): NtmsSaleorProductVariant | undefined {
  return variants.find(isSaleorVariantAvailable) ?? variants[0];
}

export function isSaleorColorAttribute(
  group: Pick<NtmsSaleorVariantAttributeGroup, "name" | "slug">,
) {
  return /(?:^|[-_\s])colou?r(?:$|[-_\s])/i.test(`${group.name} ${group.slug}`);
}

export function getSaleorColorSwatch(valueName: string) {
  return (
    colorSwatches.find(([pattern]) => pattern.test(valueName))?.[1] ?? null
  );
}

export function isSaleorVariantAttributeValueAvailable(
  variants: NtmsSaleorProductVariant[],
  groups: NtmsSaleorVariantAttributeGroup[],
  selectedVariant: NtmsSaleorProductVariant,
  groupIndex: number,
  valueId: string,
) {
  const group = groups[groupIndex];
  if (!group) {
    return false;
  }

  return getSelectableVariants(variants).some(
    (variant) =>
      matchesPriorSelections(variant, groups, selectedVariant, groupIndex) &&
      getAttributeValueId(variant, group.id) === valueId,
  );
}

export function resolveSaleorVariantAttributeSelection(
  variants: NtmsSaleorProductVariant[],
  groups: NtmsSaleorVariantAttributeGroup[],
  selectedVariant: NtmsSaleorProductVariant,
  groupIndex: number,
  valueId: string,
): NtmsSaleorProductVariant {
  const group = groups[groupIndex];
  if (!group) {
    return selectedVariant;
  }

  const selectable = getSelectableVariants(variants);
  return (
    selectable.find(
      (variant) =>
        matchesPriorSelections(variant, groups, selectedVariant, groupIndex) &&
        getAttributeValueId(variant, group.id) === valueId,
    ) ?? selectedVariant
  );
}

export function NtmsSaleorVariantSelector({
  groups,
  onSelectVariant,
  selectedVariant,
  variants,
}: {
  groups: NtmsSaleorVariantAttributeGroup[];
  onSelectVariant: (variantId: string) => void;
  selectedVariant: NtmsSaleorProductVariant;
  variants: NtmsSaleorProductVariant[];
}) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-5" data-saleor-variant-attribute-selector>
      {groups.map((group, groupIndex) => {
        const selectedValueId = getAttributeValueId(selectedVariant, group.id);
        const isColorAttribute = isSaleorColorAttribute(group);

        return (
          <div data-saleor-variant-attribute-name={group.name} key={group.id}>
            <p className="mb-2 text-xs font-bold uppercase text-foreground/52">
              {group.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const selected = selectedValueId === value.id;
                const swatch = isColorAttribute
                  ? getSaleorColorSwatch(value.name)
                  : null;
                const available = isSaleorVariantAttributeValueAvailable(
                  variants,
                  groups,
                  selectedVariant,
                  groupIndex,
                  value.id,
                );

                return (
                  <button
                    aria-label={`Select ${group.name}: ${value.name}`}
                    aria-pressed={selected}
                    className={clsx(
                      "min-h-10 max-w-full border border-[color:var(--cyber-gold)]/20 bg-background px-3 py-2 text-left text-sm font-semibold text-foreground transition focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-gold)]/40 disabled:cursor-not-allowed disabled:opacity-35",
                      {
                        "border-[color:var(--cyber-gold)]/70 bg-[color:var(--cyber-gold)]/14 text-[color:var(--cyber-gold-soft)]":
                          selected,
                        "hover:border-[color:var(--cyber-gold)]/45 hover:bg-[color:var(--cyber-gold)]/8":
                          !selected && available,
                      },
                    )}
                    disabled={!available}
                    key={value.id}
                    onClick={() => {
                      const next = resolveSaleorVariantAttributeSelection(
                        variants,
                        groups,
                        selectedVariant,
                        groupIndex,
                        value.id,
                      );
                      onSelectVariant(next.id);
                    }}
                    title={`${group.name}: ${value.name}`}
                    type="button"
                  >
                    {isColorAttribute ? (
                      <span
                        aria-hidden="true"
                        className="mr-2 inline-block h-4 w-4 shrink-0 border border-foreground/25 align-[-0.15em]"
                        data-saleor-variant-color-swatch={
                          swatch ? "resolved" : "fallback"
                        }
                        style={swatch ? { backgroundColor: swatch } : undefined}
                      />
                    ) : null}
                    {value.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getAttributePriority(name: string) {
  const index = preferredAttributeOrder.indexOf(name.trim().toLowerCase());
  return index === -1 ? preferredAttributeOrder.length : index;
}

function getSelectableVariants(variants: NtmsSaleorProductVariant[]) {
  const inStock = variants.filter(isSaleorVariantAvailable);
  return inStock.length > 0 ? inStock : variants;
}

function isSaleorVariantAvailable(variant: NtmsSaleorProductVariant) {
  return (
    typeof variant.quantityAvailable === "number" &&
    Number.isFinite(variant.quantityAvailable) &&
    variant.quantityAvailable > 0
  );
}

function matchesPriorSelections(
  variant: NtmsSaleorProductVariant,
  groups: NtmsSaleorVariantAttributeGroup[],
  selectedVariant: NtmsSaleorProductVariant,
  groupIndex: number,
) {
  return groups.slice(0, groupIndex).every((group) => {
    const selectedValueId = getAttributeValueId(selectedVariant, group.id);
    return (
      !selectedValueId ||
      getAttributeValueId(variant, group.id) === selectedValueId
    );
  });
}

function getAttributeValueId(
  variant: NtmsSaleorProductVariant,
  attributeId: string,
) {
  return variant.attributes.find((attribute) => attribute.id === attributeId)
    ?.values[0]?.id;
}
