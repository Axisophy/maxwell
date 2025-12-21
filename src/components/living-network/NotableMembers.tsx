import { NotableMember } from '@/lib/living-network/types';

interface NotableMembersProps {
  members: NotableMember[];
  kingdomColor: string;
}

export default function NotableMembers({ members, kingdomColor }: NotableMembersProps) {
  if (!members || members.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-light text-black mb-4">Notable Members</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {members.map(member => (
          <div key={member.id} className="bg-white rounded-xl p-4 text-center">
            {/* Placeholder for image */}
            <div
              className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white text-2xl font-light"
              style={{ backgroundColor: kingdomColor, opacity: member.isExtinct ? 0.6 : 1 }}
            >
              {member.name.charAt(0)}
            </div>
            <div className={`text-sm font-sans ${member.isExtinct ? 'italic' : ''}`}>
              {member.commonName || member.name}
              {member.isExtinct && <span className="ml-1 text-black/40">†</span>}
            </div>
            <div className="text-xs text-black/40 italic mt-1">{member.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
