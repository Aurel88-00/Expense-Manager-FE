import type { TModalProps, TModalFooterProps } from './interface';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, className = '' }: TModalProps) => {
  if (!isOpen) return null;

  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }

  const handleEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title" onKeyDown={handleEscapeKey}>
      <div
        className="fixed inset-0 bg-background/75 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`relative bg-card rounded-xl shadow-2xl max-h-[90vh] w-full max-w-lg overflow-hidden transform transition-all duration-200 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted sticky top-0 z-10">
          <h3 id="modal-title" className="text-lg font-semibold text-foreground truncate pr-4">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
            aria-label="Close modal"
            type="button"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ModalFooter = ({
  onClose,
  onSubmit,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  isLoading = false,
}: TModalFooterProps) => (
  <div className="bg-muted px-6 py-4 border-t border-border flex flex-col-reverse sm:flex-row gap-3 sm:justify-end sticky bottom-0">
    <button
      type="button"
      onClick={onClose}
      disabled={isLoading}
      className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border border-border shadow-sm px-4 py-2.5 bg-secondary text-sm font-medium text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={cancelLabel}
    >
      {cancelLabel}
    </button>
    {onSubmit && (
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={submitLabel}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" aria-hidden="true" />
            <span>Loading...</span>
          </>
        ) : (
          submitLabel
        )}
      </button>
    )}
  </div>
);
