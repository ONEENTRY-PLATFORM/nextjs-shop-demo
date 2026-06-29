/**
 * Human-readable labels for OneEntry order status markers.
 *
 * ⚠️ Status markers are project-specific — configured in the OneEntry admin
 * panel (Orders → statuses). The entries below were observed in this codebase
 * and may be incomplete.
 * TODO: verify and complete this map against the admin panel.
 */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  created: 'Created',
  inProgress: 'In progress',
  canceled: 'Canceled',
};

/**
 * Returns the human-readable label for an order status marker, falling back to
 * the raw marker (then empty string) when the marker is unknown.
 * @param   {string | null | undefined} marker - Order status marker.
 * @returns {string}                           Display label.
 */
export const getOrderStatusLabel = (
  marker: string | null | undefined,
): string => (marker ? (ORDER_STATUS_LABELS[marker] ?? marker) : '');
