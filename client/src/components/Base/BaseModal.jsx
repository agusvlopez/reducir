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
        <Modal
            classNames={{
                closeButton: "top-4 end-4 cursor-pointer"
            }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}>
            <ModalContent className="rounded-[30px] bg-[#F5F5F5] text-[#383838] pt-4 pb-2">
                {(onClose) => (
                    <>
                        <ModalHeader className="pt-8">{title}</ModalHeader>
                        <ModalBody>
                            {children}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                className="text-[#383838] font-semibold cursor-pointer" variant="light" onPress={onClose}>
                                Cerrar
                            </Button>
                            <Button
                                className="bg-[#005840] text-[#F1EDEC] font-semibold cursor-pointer"
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