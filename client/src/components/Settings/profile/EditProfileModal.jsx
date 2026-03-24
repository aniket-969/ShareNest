import ProfileSettingsForm from "@/components/form/ProfileSettingsForm";
import FormWrapper from "@/components/ui/formWrapper";
import ChangePasswordModal from "./ChangePasswordModal";

const EditProfileModal = ({ open, onClose, user, onSave }) => {
  if (!open) return null;

  return (
    <FormWrapper onClose={onClose} className="">
      <ProfileSettingsForm
        initialData={user}
        onCancel={onClose}
        onSave={() => {
          onSave();
          onClose();
        }}
      />
      <ChangePasswordModal variant="outline" />
    </FormWrapper>
  );
};

export default EditProfileModal;
