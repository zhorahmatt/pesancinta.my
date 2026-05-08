import { useEffect, useState } from 'react';
import { WorkshopBasicsForm } from '../../components/admin/WorkshopBasicsForm';
import { WorkshopContentForm } from '../../components/admin/WorkshopContentForm';
import { createWorkshop, getAdminWorkshopById, updateWorkshop, type WorkshopBasicsInput } from '../../lib/workshops';
import type { Workshop } from '../../types/workshop';

type WorkshopEditorPageProps = {
  workshopId?: string;
};

export function WorkshopEditorPage({ workshopId }: WorkshopEditorPageProps) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(workshopId));
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!workshopId) return;
    let isMounted = true;

    getAdminWorkshopById(workshopId).then(({ data, error }) => {
      if (!isMounted) return;
      if (error) setErrorMessage(error.message);
      setWorkshop(data ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [workshopId]);

  const handleSubmit = async (input: WorkshopBasicsInput) => {
    setIsSaving(true);
    setErrorMessage(null);

    const { data, error } = workshopId ? await updateWorkshop(workshopId, input) : await createWorkshop(input);

    setIsSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    window.location.assign(`/admin/workshops/${data.id}`);
  };

  return (
    <div>
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Workshop basics</div>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em]">{workshopId ? 'Edit workshop' : 'Create workshop'}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-primary/72">
          Set title, URL slug, schedule, venue, capacity, status, and default locale before adding content and payments.
        </p>
      </div>

      {isLoading ? (
        <div className="mt-8 rounded-xl border border-white/10 p-6 text-sm text-primary/68">Loading workshop...</div>
      ) : (
        <>
          <WorkshopBasicsForm errorMessage={errorMessage} isSaving={isSaving} onSubmit={handleSubmit} workshop={workshop} />
          {workshop && <WorkshopContentForm workshop={workshop} />}
        </>
      )}
    </div>
  );
}
