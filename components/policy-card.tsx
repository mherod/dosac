import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Policy } from "@/lib/policies";
import { getPolicyStatusColour } from "@/lib/policies";

export function PolicyCard({ policy }: { policy: Policy }) {
  return (
    <Link href={`/policies/${policy.id}`}>
      <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#0b0c0c]">
            {policy.name}
          </CardTitle>
          <CardDescription className="mt-2">
            <span className="text-xs text-gray-500">
              Minister: {policy.minister}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 line-clamp-3 text-sm text-gray-600">
            {policy.description}
          </p>

          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={`capitalize ${getPolicyStatusColour(policy.status)}`}
            >
              {policy.status}
            </Badge>

            {policy.outcome && (
              <Badge className="bg-green-100 text-xs text-green-800">
                Implemented {policy.outcome.year}
              </Badge>
            )}
          </div>

          {policy.nicknames.length > 0 && (
            <div className="mt-3">
              <span className="text-xs italic text-gray-500">
                Also known as: {policy.nicknames[0]}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
