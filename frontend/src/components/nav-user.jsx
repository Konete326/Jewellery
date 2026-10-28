"use client";

import { useNavigate } from "react-router-dom";
import { logoutUser, getAuthUser } from "@/lib/auth";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon, BellIcon, CommandIcon, LifeBuoyIcon, BookOpenIcon, CreditCardIcon, LogOutIcon } from "lucide-react";

export function NavUser() {
	const navigate = useNavigate();

	const getUser = () => {
		const saved = getAuthUser();
		if (saved) {
			return {
				name: saved.name || "Atelier Director",
				email: saved.email || "admin@gmail.com",
				avatar: saved.avatar || ""
			};
		}
		return { name: "Atelier Director", email: "admin@gmail.com", avatar: "" };
	};

	const user = getUser();

	const handleLogout = async () => {
		await logoutUser();
		navigate("/login");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="size-8 cursor-pointer">
					<AvatarImage src={user.avatar} />
					<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-60">
				<DropdownMenuGroup>
					<DropdownMenuLabel className="pointer-events-none flex items-center gap-2">
						<Avatar className="isolate size-8">
							<AvatarImage src={user.avatar} />
							<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<span className="font-medium text-foreground">{user.name}</span>
							<br />
							<div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground text-xs">
								{user.email}
							</div>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => navigate('/admin/profile')} className="cursor-pointer">
						<UserIcon />
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => navigate('/admin/inquiries')} className="cursor-pointer">
						<BellIcon />
						Notifications
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => navigate('/admin/rates')} className="cursor-pointer">
						<CommandIcon />
						Gold Rates
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => navigate('/contact')} className="cursor-pointer">
						<LifeBuoyIcon />
						Atelier Support
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => navigate('/gallery')} className="cursor-pointer">
						<BookOpenIcon />
						Live Catalog
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => navigate('/admin/accounts')} className="cursor-pointer">
						<CreditCardIcon />
						Bank Accounts
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem variant="destructive" onClick={handleLogout} className="cursor-pointer">
						<LogOutIcon />
						Log out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
