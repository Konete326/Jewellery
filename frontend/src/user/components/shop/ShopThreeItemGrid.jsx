import React from 'react';
import { ShopTile } from './ShopTile';

export function ShopThreeItemGrid({ items = [] }) {
  if (!items || items.length < 3) return null;

  const [firstItem, secondItem, thirdItem] = items;

  return (
    <section className="w-full pb-8 sm:pb-12">
      <div className="grid gap-4 sm:gap-6 md:grid-cols-6 md:grid-rows-2 min-h-[480px] md:h-[620px]">
        <div className="md:col-span-4 md:row-span-2 h-full">
          <ShopTile
            piece={firstItem}
            priority={true}
            position="center"
            className="h-full min-h-[360px] md:min-h-full"
          />
        </div>

        <div className="md:col-span-2 md:row-span-1 h-full">
          <ShopTile
            piece={secondItem}
            priority={true}
            position="bottom"
            className="h-full min-h-[260px] md:min-h-full"
          />
        </div>

        <div className="md:col-span-2 md:row-span-1 h-full">
          <ShopTile
            piece={thirdItem}
            priority={false}
            position="bottom"
            className="h-full min-h-[260px] md:min-h-full"
          />
        </div>
      </div>
    </section>
  );
}
