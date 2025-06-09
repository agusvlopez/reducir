import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from "@heroui/react";

export function BaseModal({
    isOpen,
    onOpenChange,
    title,
    children
}) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent className="rounded-[30px] bg-[#F5F5F5] text-[#383838] pt-4 pb-2">
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                        <ModalBody>
                            {children}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                className="text-[#383838] font-semibold" variant="light" onPress={onClose}>
                                Cerrar
                            </Button>
                            <Button
                                className="bg-[#005840] text-[#F1EDEC] font-semibold"
                                onPress={onClose}
                                radius="full">
                                Aceptar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}