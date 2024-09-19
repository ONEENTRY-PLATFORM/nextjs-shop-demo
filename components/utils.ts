import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';

export const UsePrice = ({
  amount,
  currency,
}: {
  amount: number | string;
  currency: string;
}) => {
  if (currency === 'USDT') {
    return amount + ' USDT';
  }
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(Number(amount));

  return formattedPrice;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortObjectFieldsByPosition = (obj: Record<any, any>) => {
  const entries = Object.entries(obj);
  entries.sort((a, b) => a[1].position - b[1].position);
  const sortedObj = {};
  for (const [key, value] of entries) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    sortedObj[key] = value;
  }
  return sortedObj;
};

export const flatMenuToNested = (
  data: [] | Array<IMenusPages>,
  pid: number | null,
) => {
  return data.reduce((r: IMenusPages[], element: IMenusPages) => {
    if (pid == element.parentId) {
      const object = { ...element };
      const children = flatMenuToNested(data, element.id);
      if (children.length) {
        object.children = children;
      }
      r.push(object);
    }
    return r;
  }, []);
};
