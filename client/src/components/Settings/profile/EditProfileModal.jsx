import ProfileSettingsForm from "@/components/form/ProfileSettingsForm";
import FormWrapper from "@/components/ui/formWrapper";


const EditProfileModal = ({ open, onClose, user, onSave }) => {
  if (!open) return null;
 
  return (
    <FormWrapper onClose={onClose}>
      <ProfileSettingsForm
        initialData={user}
        onCancel={onClose}
        onSave={() => {
          onSave(); 
          onClose();
        }}
      />
    </FormWrapper>
  );
};

export default EditProfileModal;
