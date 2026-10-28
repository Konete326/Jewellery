'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, SparklesIcon } from 'lucide-react';

function FilledCheck() {
	return (
		<div className="bg-primary text-primary-foreground rounded-full p-0.5 shrink-0">
			<CheckIcon className="size-3" strokeWidth={3} />
		</div>
	);
}

function PricingCard({
	titleBadge,
	priceLabel,
	priceSuffix = '/month',
	features = [],
	cta = 'Subscribe',
	className,
}) {
	return (
		<div
			className={cn(
				'bg-background border-foreground/10 relative overflow-hidden rounded-xl border',
				'supports-[backdrop-filter]:bg-background/10 backdrop-blur',
				className
			)}
		>
			<div className="flex items-center gap-3 p-4">
				<Badge variant="secondary">{titleBadge}</Badge>
				<div className="ml-auto">
					<Button variant="outline" size="sm">{cta}</Button>
				</div>
			</div>

			<div className="flex items-end gap-2 px-4 py-2">
				<span className="font-mono text-4xl sm:text-5xl font-semibold tracking-tight">
					{priceLabel}
				</span>
				{priceLabel.toLowerCase() !== 'free' && (
					<span className="text-muted-foreground text-sm mb-1">{priceSuffix}</span>
				)}
			</div>

			<ul className="text-muted-foreground grid gap-3 p-4 text-sm">
				{features.map((f, i) => (
					<li key={i} className="flex items-center gap-3">
						<FilledCheck />
						<span>{f}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export function BentoPricing() {
	return (
		<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-8">
			<div
				className={cn(
					'bg-background border-foreground/10 relative w-full overflow-hidden rounded-xl border',
					'supports-[backdrop-filter]:bg-background/10 backdrop-blur',
					'lg:col-span-5'
				)}
			>
				<div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
					<div className="from-foreground/5 to-foreground/2 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
						<div
							aria-hidden="true"
							className={cn(
								'absolute inset-0 size-full mix-blend-overlay',
								'bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)]',
								'bg-[size:24px]'
							)}
						/>
					</div>
				</div>
				<div className="flex items-center gap-3 p-4 relative z-10">
					<Badge variant="secondary">CREATORS SPECIAL</Badge>
					<Badge variant="outline" className="hidden lg:flex items-center gap-1">
						<SparklesIcon className="size-3" />
						<span>Most Recommended</span>
					</Badge>
					<div className="ml-auto">
						<Button size="sm">Subscribe</Button>
					</div>
				</div>
				<div className="flex flex-col p-4 lg:flex-row relative z-10">
					<div className="pb-4 lg:w-[30%]">
						<span className="font-mono text-4xl sm:text-5xl font-semibold tracking-tight">
							$19
						</span>
						<span className="text-muted-foreground text-sm">/month</span>
					</div>
					<ul className="text-muted-foreground grid gap-3 text-sm lg:w-[70%]">
						{[
							'Perfect for individual bloggers',
							'Freelancers and entrepreneurs',
							'AI-Powered editing tools',
							'Basic Analytics to track content performance',
						].map((f, i) => (
							<li key={i} className="flex items-center gap-3">
								<FilledCheck />
								<span className="leading-relaxed">{f}</span>
							</li>
						))}
					</ul>
				</div>
			</div>

			<PricingCard
				titleBadge="STARTERS"
				priceLabel="$0"
				features={[
					'Perfect for beginners',
					'Unlimited Content Generation',
					'AI-Powered editing tools',
				]}
				className="lg:col-span-3"
			/>

			<PricingCard
				titleBadge="TEAMS"
				priceLabel="$49"
				features={[
					'Ideal for small teams and agencies',
					'Collaborative features like shared projects',
					'Advanced Analytics to optimize content strategy',
				]}
				className="lg:col-span-4"
			/>

			<PricingCard
				titleBadge="ENTERPRISE"
				priceLabel="$99"
				features={[
					'Designed for large companies',
					'High-volume content creators',
					'Dedicated account management',
				]}
				className="lg:col-span-4"
			/>
		</div>
	);
}

export { PricingCard };
